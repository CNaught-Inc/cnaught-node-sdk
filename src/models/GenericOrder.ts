import { OrderState } from './OrderState';
import { OrderType } from './OrderType';

/** Generic Offset order for a given amount of CO2 */
export interface GenericOrder {
    id: string;
    amount_kg: number;
    created_on: string;
    metadata?: string;
    description?: string;
    price_usd_cents: number;
    state: OrderState;
    type: OrderType;
    callback_url?: string;
    certificate_public_url?: string;
    certificate_download_public_url?: string;
}
