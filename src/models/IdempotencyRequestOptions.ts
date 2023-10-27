/**
 * Additional request options for specifying an idempotency key
 */
export interface IdempotencyRequestOptions {
    /**
     * Idempotency key for the request.
     * See https://docs.cnaught.com/api/#idempotency
     */
    idempotencyKey?: string;
}
