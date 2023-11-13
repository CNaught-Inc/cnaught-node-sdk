/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */

import { CNaughtError } from './models/CNaughtError.js';
import wretch from 'wretch';
import type { Wretch } from 'wretch';
import type {
    HttpProblemExtensionMapper,
    ProblemObject
} from 'http-problem-details-parser';
import { fromObject } from 'http-problem-details-parser';
import { ProblemDocumentExtension } from 'http-problem-details';
import { invalidParametersProblemType } from './models/CNaughtProblemDetails.js';
import { version } from './version.js';
import type { CNaughtProblemDetails } from './models/CNaughtProblemDetails.js';
import type { ApiRequestOptions } from './api-client.js';
import type {
    IdempotencyRequestOptions,
    SubaccountRequestOptions
} from './models/index.js';

type InternalRequestOptions = ApiRequestOptions &
    IdempotencyRequestOptions &
    SubaccountRequestOptions & {
        headers?: HeadersInit;
    };

const mappers: HttpProblemExtensionMapper[] = [
    {
        type: invalidParametersProblemType,
        map: (object: any) =>
            new ProblemDocumentExtension({
                errors: object['errors']
            })
    }
];

/**
 * This class handles creating and sending requests as well as catching common errors
 */
export class ApiRequestHandler {
    /** Single instance of axios which uses provided arguments for all requests */
    wretch: Wretch;

    constructor(
        baseUrl: string,
        apiKey: string,
        fetch?: (
            input: RequestInfo | URL,
            init?: RequestInit
        ) => Promise<Response>
    ) {
        this.wretch = wretch(baseUrl, { mode: 'cors' })
            .polyfills({
                fetch: fetch ?? globalThis.fetch.bind(this)
            })
            .auth(`Bearer ${apiKey}`)
            .headers({
                'User-Agent': `CNaught-NodeSDK/${version}`
            })
            .errorType('json')
            .catcherFallback((error) => {
                if (!error.json) {
                    throw error;
                }
                const problemDetailsObject = error.json as ProblemObject;
                const problemDetails = fromObject(
                    problemDetailsObject,
                    mappers
                ) as CNaughtProblemDetails;
                throw new CNaughtError(error, problemDetails);
            });
    }

    public makeApiGetRequest = <Response>(
        url: string,
        requestOptions?: Omit<InternalRequestOptions, 'data'>
    ) =>
        this.wretch
            .headers(this.getHeaders(false, requestOptions))
            .options({
                ...requestOptions?.extraRequestOptions
            })
            .get(url)
            .json<Response>();

    public makeApiPostRequest = <Response>(
        url: string,
        data: unknown | null,
        requestOptions?: InternalRequestOptions
    ) =>
        this.wretch
            .headers(this.getHeaders(data !== null, requestOptions))
            .options({
                ...requestOptions?.extraRequestOptions
            })
            .post(data, url)
            .json<Response>();

    private getHeaders(
        hasData: boolean,
        requestOptions?: InternalRequestOptions
    ): HeadersInit {
        const headers: HeadersInit = {};
        if (requestOptions?.idempotencyKey) {
            headers['Idempotency-Key'] = requestOptions.idempotencyKey;
        }
        if (hasData) {
            headers['Content-Type'] = 'application/json';
        }
        if (requestOptions?.subaccountId) {
            headers['X-Subaccount-Id'] = requestOptions.subaccountId;
        }
        return {
            ...headers,
            ...requestOptions?.headers
        };
    }
}
