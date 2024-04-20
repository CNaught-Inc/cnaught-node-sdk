import type { BaseQuoteParams } from './BaseQuoteParams.js';

/**
 * Params for getting a carbon credits price quote for air freight emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestAirFreightQuote for more details.
 */
export interface AirFreightQuoteParams extends BaseQuoteParams {
    freight_mass_kg: number;
    distance_km: number;
}
