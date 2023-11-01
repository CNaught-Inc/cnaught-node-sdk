/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */

import { CNaughtError } from './models/CNaughtError.js';
import ky from 'ky';
//import fetch from 'isomorphic-unfetch';
import type {
    HttpProblemExtensionMapper,
    ProblemObject
} from 'http-problem-details-parser';
import { fromObject } from 'http-problem-details-parser';
import { ProblemDocumentExtension } from 'http-problem-details';
import { invalidParametersProblemType } from './models/CNaughtProblemDetails.js';
import type { CNaughtProblemDetails } from './models/CNaughtProblemDetails.js';
import packageJson from '../package.json' assert { type: 'json' };

export type HttpMethodTypes = 'POST' | 'GET' | 'DELETE';
type KyInstance = typeof ky;

export type CNaughtHeadersInit =
    | HeadersInit
    | Record<string, string | undefined>;

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

    public async makeApiRequest<Response>(
        method: HttpMethodTypes,
        url: string,
        headers: CNaughtHeadersInit,
        data: unknown | undefined = undefined
    ): Promise<Response> {
        const response = this.instance(url, {
            body: data ? JSON.stringify(data) : undefined,
            method,
            headers
        });
        return await response.json<Response>();
    }
}
