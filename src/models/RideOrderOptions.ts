import type { BaseOrderOptions } from './BaseOrderOptions.js';

/**
 * Options that can used when submitting a ride offset order
 * See https://docs.cnaught.com/api/reference/#operation/SubmitRideOrder for more details.
 */
export interface RideOrderOptions extends BaseOrderOptions {
    distance_km: number;
}
