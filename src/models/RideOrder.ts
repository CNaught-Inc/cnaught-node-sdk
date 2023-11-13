import type { GenericOrder } from './GenericOrder.js';

/** Ride offset order for a vehicle ride  */
export interface RideOrder extends GenericOrder {
    distance_km: number;
}
