import type { BaseQuoteParams } from './BaseQuoteParams.js';

/**
 * Params for getting a carbon credits price quote for flight emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestFlightQuote for more details.
 */
export interface FlightQuoteParams extends BaseQuoteParams {
    distance_km: number;
}
