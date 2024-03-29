import type { OrderState } from './OrderState.js';
import type { OrderType } from './OrderType.js';
import type { ProjectAllocation } from './ProjectAllocation.js';

/** Generic Offset order for a given amount of CO2 */
export interface GenericOrder {
    id: string;
    order_number: string;
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
    subaccount_id?: string;
    project_allocations: ProjectAllocation[];
    checkout_session_id?: string;
}
