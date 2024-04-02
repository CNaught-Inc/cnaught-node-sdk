/**
 * Params for getting a carbon credits price quote for emissions based on total mass
 * See https://docs.cnaught.com/api/reference/#operation/RequestQuote for more details.
 */
export interface GenericQuoteParams {
    amount_kg: number;
    portfolio_id?: string;
}
