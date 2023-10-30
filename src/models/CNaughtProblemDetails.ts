import { ProblemDocument } from 'http-problem-details';

type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type ValidationProblemDetails = Override<
    ProblemDocument,
    {
        type: 'https://api.cnaught.com/v1/errors/invalid-parameters'
        errors: Record<string, string[]>
    }
>

export type NotFoundProblemDetails = Override<
    ProblemDocument,
    {
        status: 404
        type: 'https://api.cnaught.com/v1/errors/invalid-parameters'
    }
>

export type CNaughtProblemDetails = ValidationProblemDetails | NotFoundProblemDetails