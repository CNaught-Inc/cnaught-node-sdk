/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */
import axios, { AxiosInstance } from 'axios';

import { CNaughtError, InvalidParameterError, InvalidStateError } from './models/CNaughtError.js';

export type HttpMethodTypes = 'post' | 'get' | 'delete';
export type AxiosResponseTypes = 'stream' | 'json' | 'text';

//const sdkVersion = require('../package.json').version;

/**
 * This class handles creating and sending requests as well as catching common errors
 */
export class ApiRequestHandler {
    /** Single instance of axios which uses provided arguments for all requests */
    instance: AxiosInstance;

    constructor(url: string, apiKey: string) {
        this.instance = axios.create({
            baseURL: url,
            maxContentLength: Infinity,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'User-Agent': `CNaught-NodeSDK/1.2`
            }
        });
    }

    public async makeApiRequest<Response>(
        method: HttpMethodTypes,
        url: string,
        headers: {},
        responseType: AxiosResponseTypes,
        params?: {},
        maxBodyLength?: number
    ): Promise<Response> {
        try {
            const data =
                method === 'get' || method === 'delete' ? undefined : params;
            const response = await this.instance.request({
                method,
                url,
                data,
                headers,
                responseType,
                maxBodyLength
            });

            return response.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            switch (error.response.status) {
                case 400:
                    throw new InvalidParameterError(error);
                case 409:
                    throw new InvalidStateError(error);
                default:
                    throw new CNaughtError(error);
            }
        }
    }
}
