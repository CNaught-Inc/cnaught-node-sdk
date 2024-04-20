import type { BaseQuoteParams } from './BaseQuoteParams.js';

/**
 * Params for getting a carbon credits price quote for emissions based on total mass
 * See https://docs.cnaught.com/api/reference/#operation/RequestQuote for more details.
 */
export interface GenericQuoteParams extends BaseQuoteParams {
    amount_kg: number;
}
