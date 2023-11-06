/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */

import { CNaughtError } from './models/CNaughtError.js';
import ky from 'ky';
import type {
    HttpProblemExtensionMapper,
    ProblemObject
} from 'http-problem-details-parser';
import { fromObject } from 'http-problem-details-parser';
import { ProblemDocumentExtension } from 'http-problem-details';
import { invalidParametersProblemType } from './models/CNaughtProblemDetails.js';
import type { CNaughtProblemDetails } from './models/CNaughtProblemDetails.js';
import packageJson from '../package.json' assert { type: 'json' };
import type { ApiRequestOptions } from './api-client.js';
import type {
    IdempotencyRequestOptions,
    SubaccountRequestOptions
} from './models/index.js';

export type HttpMethodTypes = 'POST' | 'GET' | 'DELETE';
type KyInstance = typeof ky;

export type CNaughtHeadersInit =
    | HeadersInit
    | Record<string, string | undefined>;

type InternalRequestOptions = ApiRequestOptions &
    IdempotencyRequestOptions &
    SubaccountRequestOptions & {
        data?: unknown;
        headers?: CNaughtHeadersInit;
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
    instance: KyInstance;

    constructor(
        baseUrl: string,
        apiKey: string,
        fetch?: (
            input: RequestInfo | URL,
            init?: RequestInit
        ) => Promise<Response>
    ) {
        this.instance = ky.create({
            fetch: fetch ?? globalThis.fetch.bind(globalThis),
            prefixUrl: baseUrl,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'User-Agent': `CNaught-NodeSDK/${packageJson.version}`
            },
            hooks: {
                beforeError: [
                    async (error) => {
                        if (!error.response) {
                            return error;
                        }
                        const problemDetailsObject =
                            (await error.response.json()) as ProblemObject;
                        const problemDetails = fromObject(
                            problemDetailsObject,
                            mappers
                        ) as CNaughtProblemDetails;
                        return new CNaughtError(error, problemDetails);
                    }
                ]
            }
        });
    }

    public makeApiRequest = async <Response>(
        method: HttpMethodTypes,
        url: string,
        requestOptions?: InternalRequestOptions
    ): Promise<Response> => {
        const response = this.instance(url, {
            body: requestOptions?.data
                ? JSON.stringify(requestOptions?.data)
                : undefined,
            method,
            headers: this.getHeaders(requestOptions),
            ...requestOptions?.extraRequestOptions
        });
        return await response.json<Response>();
    };

    public makeApiGetRequest = <Response>(
        url: string,
        requestOptions?: Omit<InternalRequestOptions, 'data'>
    ) => this.makeApiRequest<Response>('GET', url, requestOptions);

    public makeApiPostRequest = <Response>(
        url: string,
        requestOptions?: InternalRequestOptions
    ) => this.makeApiRequest<Response>('POST', url, requestOptions);

    private getHeaders(
        requestOptions?: InternalRequestOptions
    ): CNaughtHeadersInit {
        const headers: CNaughtHeadersInit = {};
        if (requestOptions?.idempotencyKey) {
            headers['Idempotency-Key'] = requestOptions.idempotencyKey;
        }
        if (requestOptions?.data) {
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
