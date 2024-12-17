import type { BaseOrderOptions } from './BaseOrderOptions.js';

/**
 * Options that can used when submitting a generic offset order specifying total price.
 * See https://docs.cnaught.com/api/reference/#operation/SubmitOrder for more details.
 */
export interface OrderByPriceOptions extends BaseOrderOptions {
    total_price_usd_cents: number;
}
