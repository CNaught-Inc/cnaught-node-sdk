/**
 * Params for getting a price quote for offsetting a vehicle ride
 * See https://docs.cnaught.com/api/reference/#operation/RequestRideQuote for more details.
 */
export interface RideQuoteParams {
    distance_km: number;
    portfolio_id?: string;
}
