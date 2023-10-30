/* eslint-disable @typescript-eslint/ban-types */
import { HTTPError } from 'ky';
import type { CNaughtProblemDetails } from './CNaughtProblemDetails.js';

export class CNaughtError extends HTTPError {
    problemDetails: CNaughtProblemDetails;

    constructor(e: HTTPError, problemDetails: CNaughtProblemDetails) {
        super(e.response, e.request, e.options);

        this.problemDetails = problemDetails;
    }
}

/*
import { AxiosError } from 'axios';

export class CNaughtError {
    statusCode: number;
    details: string;

    constructor(e: AxiosError) {
        if (e.response) {
            this.statusCode = e.response.status;
            //this.details = e.response.data || '';
        }
    }
}

export class InvalidParameterError extends CNaughtError {
    parameters: {};

    constructor(e: AxiosError) {
        super(e);
        //this.parameters = e.response.data.parameters;
    }
}

export class InvalidStateError extends CNaughtError {
    currentValue: string;
    allowedValues: string[];

    constructor(e: AxiosError) {
        super(e);
        //this.currentValue = e.response.data.current_value;
        //this.allowedValues = e.response.data.allowed_values;
    }
}
*/