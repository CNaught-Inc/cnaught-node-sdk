/* eslint-disable @typescript-eslint/ban-types */
import type { CNaughtProblemDetails } from './CNaughtProblemDetails.js';

export interface CNaughtError extends Error {
    status: number;
    response: Response;
    url: string;
    problemDetails: CNaughtProblemDetails;
}
