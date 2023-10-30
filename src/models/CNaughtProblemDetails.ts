import { ProblemDocument } from 'http-problem-details';

type Override<T1, T2> = Omit<T1, keyof T2> & T2

export const invalidParametersProblemType = 'https://api.cnaught.com/v1/errors/invalid-parameters' as const;
export type InvalidParametersProblemType = typeof invalidParametersProblemType;

export const notFoundProblemType = 'https://api.cnaught.com/v1/errors/not-found' as const;
export type NotFoundProblemType = typeof notFoundProblemType;

export type ValidationProblemDetails = Override<
    ProblemDocument,
    {
        type: InvalidParametersProblemType
        errors: Record<string, string[]>
    }
>

export type NotFoundProblemDetails = Override<
    ProblemDocument,
    {
        status: 404
        type: NotFoundProblemType
    }
>

export type CNaughtProblemDetailsType = NotFoundProblemType | InvalidParametersProblemType;
export type CNaughtProblemDetails = ValidationProblemDetails | NotFoundProblemDetails