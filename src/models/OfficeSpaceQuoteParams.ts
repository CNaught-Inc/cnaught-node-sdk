/**
 * Params for getting a carbon credits price quote for office space emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestOfficeSpaceQuote for more details.
 */
export interface OfficeSpaceQuoteParams {
    square_footage: number;
    portfolio_id?: string;
}
