/**
 * Params for getting a carbon credits price quote for ground freight emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestGroundFreightQuote for more details.
 */
export interface GroundFreightQuoteParams {
    freight_mass_kg: number;
    distance_km: number;
    portfolio_id?: string;
}
