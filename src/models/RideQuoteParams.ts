import type { GroundTransportQuoteParams } from './GroundTransportQuoteParams.js';

/**
 * Params for getting a price quote for offsetting a vehicle ride
 * See https://docs.cnaught.com/api/reference/#operation/RequestRideQuote for more details.
 */
export type RideQuoteParams = Omit<GroundTransportQuoteParams, 'vehicle_type'>;
