import { BaseOrderOptions } from './BaseOrderOptions';

/**
 * Params for getting a generic offsets price quote
 * See https://docs.cnaught.com/api/reference/#operation/RequestQuote for more details.
 */
export interface GenericQuoteParams {
    amount_kg: number;
}
