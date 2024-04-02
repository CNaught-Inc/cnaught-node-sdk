/**
 * Params for getting a carbon credits price quote for ground transport emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestGroundTransportQuote for more details.
 */
export interface GroundTransportQuoteParams {
    distance_km: number;
    vehicle_type:
        | 'passenger_car_van_or_suv'
        | 'small_bus'
        | 'school_bus'
        | 'coach_bus';
    portfolio_id?: string;
}
