/**
 * Params for getting a carbon credits price quote for train emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestTrainQuote for more details.
 */
export interface TrainQuoteParams {
    distance_km: number;
    portfolio_id?: string;
}
