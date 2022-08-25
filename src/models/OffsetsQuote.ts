import { OrderState } from './OrderState';
import { OrderType } from './OrderType';

/** price quote for CO2 offsets */
export interface OffsetsQuote {
    amount_kg: number;
    price_usd_cents: number;
}
