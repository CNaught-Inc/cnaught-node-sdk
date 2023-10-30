import { BaseOrderOptions } from './BaseOrderOptions.js';

/**
 * Options that can used when submitting a generic offset order
 * See https://docs.cnaught.com/api/reference/#operation/SubmitOrder for more details.
 */
export interface GenericOrderOptions extends BaseOrderOptions {
    amount_kg: number;
}
