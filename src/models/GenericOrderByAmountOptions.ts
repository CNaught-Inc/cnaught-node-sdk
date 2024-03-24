import type { BaseOrderOptions } from './BaseOrderOptions.js';

/**
 * Options that can used when submitting a generic offset order specifying amount of CO2 to offset.
 * See https://docs.cnaught.com/api/reference/#operation/SubmitOrder for more details.
 */
export interface GenericOrderByAmountOptions extends BaseOrderOptions {
    amount_kg: number;
}
