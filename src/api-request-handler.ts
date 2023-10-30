/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */

import { CNaughtError } from './models';
import ky from 'ky';
import fetch from "isomorphic-unfetch";
import { KyInstance } from 'ky/distribution/types/ky';
import { fromObject, HttpProblemExtensionMapper, ProblemObject } from 'http-problem-details-parser';
import { ProblemDocumentExtension } from 'http-problem-details';
import { CNaughtProblemDetails } from './models/CNaughtProblemDetails';

export type HttpMethodTypes = 'post' | 'get' | 'delete';
export type AxiosResponseTypes = 'stream' | 'json' | 'text';

//const sdkVersion = require('../package.json').version;

const mappers: HttpProblemExtensionMapper[] = [
    {
        type: 'https://example.net/validation-error',
        map: (object: any) =>
            new ProblemDocumentExtension({
                'invalid-params': object['invalid-params']
            })
    }
]

/**
 * This class handles creating and sending requests as well as catching common errors
 */
export class ApiRequestHandler {
    /** Single instance of axios which uses provided arguments for all requests */
    instance: KyInstance;
    apiKey: string;
    baseUrl: string;

    constructor(url: string, apiKey: string) {
        this.instance = ky.create({
            fetch,
            prefixUrl: url,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'User-Agent': `CNaught-NodeSDK/v1.2`
            },
            hooks: {
                beforeError: [
                    async error => {
                        if (!error.response) {
                            return error;
                        }
                        const problemDetailsObject = await error.response.json() as ProblemObject;
                        const problemDetails = fromObject(problemDetailsObject, mappers) as CNaughtProblemDetails;
                        return new CNaughtError(error, problemDetails);
                    }
                ]
            }
        });
    }

    public async makeApiRequest<Response>(
        method: HttpMethodTypes,
        url: string,
        headers: {},
        data: unknown | undefined = undefined,
    ): Promise<Response> {
        try {
            const response = await fetch(`${this.baseUrl}/${url}`, {
                method,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'User-Agent': `CNaught-NodeSDK/v1.2`,
                    ...headers
                }
            });
            return await response.json() as Response;
        }
        catch(err) {

        }
    }
}
