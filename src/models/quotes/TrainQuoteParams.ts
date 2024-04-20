import type { BaseQuoteParams } from './BaseQuoteParams.js';

/**
 * Params for getting a carbon credits price quote for train emissions
 * See https://docs.cnaught.com/api/reference/#operation/RequestTrainQuote for more details.
 */
export interface TrainQuoteParams extends BaseQuoteParams {
    distance_km: number;
}
