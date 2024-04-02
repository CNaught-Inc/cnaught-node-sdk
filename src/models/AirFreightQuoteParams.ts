/**
 * Params for getting a carbon credits price quote for air freight emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestAirFreightQuote for more details.
 */
export interface AirFreightQuoteParams {
    freight_mass_kg: number;
    distance_km: number;
    portfolio_id?: string;
}
