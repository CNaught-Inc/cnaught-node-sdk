/* eslint-disable @typescript-eslint/ban-types */
import { HTTPError } from 'ky';
import { CNaughtProblemDetails } from './CNaughtProblemDetails';

export class CNaughtError extends HTTPError {
    problemDetails: CNaughtProblemDetails;

    constructor(e: HTTPError, problemDetails: CNaughtProblemDetails) {
        super(e.response, e.request, e.options);

        this.problemDetails = problemDetails;
    }
}
