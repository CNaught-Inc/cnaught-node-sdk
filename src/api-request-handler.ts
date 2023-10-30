/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */

import { CNaughtError } from './models/CNaughtError.js';
import ky from 'ky';
//import fetch from "isomorphic-unfetch";
import { fromObject, HttpProblemExtensionMapper, ProblemObject } from 'http-problem-details-parser';
import { ProblemDocumentExtension } from 'http-problem-details';
import { CNaughtProblemDetails, invalidParametersProblemType } from './models/CNaughtProblemDetails.js';
//import packageJson from "../package.json" assert { type: "json" };

export type HttpMethodTypes = 'post' | 'get' | 'delete';
export type AxiosResponseTypes = 'stream' | 'json' | 'text';
type KyInstance = typeof ky;

//const sdkVersion = require('../package.json').version;

const mappers: HttpProblemExtensionMapper[] = [
    {
        type: invalidParametersProblemType,
        map: (object: any) =>
            new ProblemDocumentExtension({
                'errors': object['errors']
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
                'User-Agent': `CNaught-NodeSDK2/v2.0`
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
        const response = this.instance(url, {
            json: data,
            method,
            headers
        });
        return await response.json<Response>();
    }
}