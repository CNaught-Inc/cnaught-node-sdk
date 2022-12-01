/**
 * Additional request options
 */
export interface RequestOptions {
    /**
     * Idempotency key for the request.
     * See https://docs.cnaught.com/api/#idempotency
     */
    idempotencyKey?: string;
}

