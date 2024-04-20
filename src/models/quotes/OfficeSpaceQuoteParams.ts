import type { BaseQuoteParams } from './BaseQuoteParams.js';

/**
 * Params for getting a carbon credits price quote for office space emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestOfficeSpaceQuote for more details.
 */
export interface OfficeSpaceQuoteParams extends BaseQuoteParams {
    square_footage: number;
}
