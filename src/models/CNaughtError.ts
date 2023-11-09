import type { CNaughtProblemDetails } from './CNaughtProblemDetails.js';
import type { WretchError } from 'wretch';

export class CNaughtError extends Error {
    problemDetails: CNaughtProblemDetails;
    status: number;
    response: Response;
    url: string;

    constructor(e: WretchError, problemDetails: CNaughtProblemDetails) {
        super(problemDetails.title);

        this.status = e.status;
        this.response = e.response;
        this.url = e.url;
        this.problemDetails = problemDetails;
    }
}
