/**
 * Params for getting a carbon credits price quote for flight emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestFlightQuote for more details.
 */
export interface FlightQuoteParams {
    distance_km: number;
    portfolio_id?: string;
}
