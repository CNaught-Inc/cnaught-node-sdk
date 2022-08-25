/* eslint-disable @typescript-eslint/ban-types */
import { AxiosError } from 'axios';

export class CNaughtError {
    statusCode: number;
    details: string;

    constructor(e: AxiosError) {
        if (e.response) {
            this.statusCode = e.response.status;
            this.details = e.response.data || '';
        }
    }
}

export class InvalidParameterError extends CNaughtError {
    parameters: {};

    constructor(e: AxiosError) {
        super(e);
        this.parameters = e.response.data.parameters;
    }
}

export class InvalidStateError extends CNaughtError {
    currentValue: string;
    allowedValues: string[];

    constructor(e: AxiosError) {
        super(e);
        this.currentValue = e.response.data.current_value;
        this.allowedValues = e.response.data.allowed_values;
    }
}
