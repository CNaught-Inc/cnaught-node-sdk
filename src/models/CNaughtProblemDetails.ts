import { ProblemDocument } from 'http-problem-details';

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export const invalidParametersProblemType =
    'https://api.cnaught.com/v1/errors/invalid-parameters' as const;
export type InvalidParametersProblemType = typeof invalidParametersProblemType;

export const invalidPaginationProblemType =
    'https://api.cnaught.com/v1/errors/invalid-pagination' as const;
export type InvalidPaginationProblemType = typeof invalidPaginationProblemType;

export const invalidSubaccountProblemType =
    'https://api.cnaught.com/v1/errors/invalid-subaccount' as const;
export type InvalidSubaccountProblemType = typeof invalidSubaccountProblemType;

export const notFoundProblemType =
    'https://api.cnaught.com/v1/errors/not-found' as const;
export type NotFoundProblemType = typeof notFoundProblemType;

export const forbiddenProblemType =
    'https://api.cnaught.com/v1/errors/forbidden' as const;
export type ForbiddenProblemType = typeof forbiddenProblemType;

export const idempotencyChangedPayloadProblemType =
    'https://api.cnaught.com/v1/errors/idempotency-changed-payload' as const;
export type IdempotencyChangedPayloadProblemType =
    typeof idempotencyChangedPayloadProblemType;

export const idempotencyConcurrentRequestsProblemType =
    'https://api.cnaught.com/v1/errors/idempotency-concurrent-requests' as const;
export type IdempotencyConcurrentRequestsProblemType =
    typeof idempotencyConcurrentRequestsProblemType;

export const idempotencyKeyTooLongProblemType =
    'https://api.cnaught.com/v1/errors/idempotency-key-too-long' as const;
export type IdempotencyKeyTooLongProblemType =
    typeof idempotencyKeyTooLongProblemType;

export type ValidationProblemDetails = Override<
    ProblemDocument,
    {
        status: 400;
        type: InvalidParametersProblemType;
        errors: Record<string, string[]>;
    }
>;

export type InvalidPaginationProblemDetails = Override<
    ProblemDocument,
    {
        status: 400;
        type: InvalidSubaccountProblemType;
        detail: string;
    }
>;

export type InvalidSubaccountProblemDetails = Override<
    ProblemDocument,
    {
        status: 400;
        type: InvalidSubaccountProblemType;
    }
>;

export type NotFoundProblemDetails = Override<
    ProblemDocument,
    {
        status: 404;
        type: NotFoundProblemType;
    }
>;

export type ForbiddenProblemDetails = Override<
    ProblemDocument,
    {
        status: 403;
        type: ForbiddenProblemType;
    }
>;

export type IdempotencyChangedPayloadProblemDetails = Override<
    ProblemDocument,
    {
        status: 422;
        type: IdempotencyChangedPayloadProblemType;
    }
>;

export type IdempotencyConcurrentRequestsProblemDetails = Override<
    ProblemDocument,
    {
        status: 409;
        type: IdempotencyConcurrentRequestsProblemType;
    }
>;

export type IdempotencyKeyTooLongProblemDetails = Override<
    ProblemDocument,
    {
        status: 400;
        type: IdempotencyKeyTooLongProblemType;
    }
>;

export type CNaughtProblemType =
    | NotFoundProblemType
    | ForbiddenProblemType
    | InvalidParametersProblemType
    | InvalidPaginationProblemType
    | InvalidSubaccountProblemType
    | IdempotencyKeyTooLongProblemType
    | IdempotencyChangedPayloadProblemType
    | IdempotencyConcurrentRequestsProblemType;

export type CNaughtProblemDetails =
    | NotFoundProblemDetails
    | ForbiddenProblemDetails
    | ValidationProblemDetails
    | InvalidPaginationProblemDetails
    | InvalidSubaccountProblemDetails
    | IdempotencyKeyTooLongProblemDetails
    | IdempotencyChangedPayloadProblemDetails
    | IdempotencyConcurrentRequestsProblemDetails;
