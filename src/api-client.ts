/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/ban-types */
import { ApiRequestHandler } from './api-request-handler';
import { GenericOrderOptions } from './models/GenericOrderOptions';
import { RideOrderOptions } from './models/RideOrderOptions';
import { GenericOrder } from './models/GenericOrder';
import { RideOrder } from './models/RideOrder';
import { List } from './models/List';

/**
 * Client which handles executing CNaught API requests.
 */
export class CNaughtApiClient {
    apiHandler: ApiRequestHandler;

    /**
     * @param apiKey API Key used to authenticate API requests
     * @param hostname (optional) the hostname of the API server to make requests against. Defaults to api.cnaught.com.
     * @param version (optional) version of the API to be used, default is v1 (current version)
     */
    constructor (apiKey: string, hostname = 'api.cnaught.com', version = 'v1') {
        this.apiHandler = new ApiRequestHandler(`https://${hostname}/${version}/`, apiKey);
    }

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetOrderById
     * Get details for a specific offset order
     * @param id Id of the order whose details are to be retrieved
     * @returns Order details
     */
    async getOrderDetails(id: string): Promise<GenericOrder> {
        return await this.apiHandler.makeApiRequest<GenericOrder>('get', `/orders/${id}`, {}, 'json');
    }

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetListOfOrder
     * Get a list of offset orders in reverse chronological order
     * (last submitted first) up to the provided limit number of orders per call. Pagination is supported via passing
     * the last order id from previous call into starting_after.
     * @param limit (optional) maximum number of orders to retrieve, default is 100
     * @param startingAfter (optional) returns only orders created after the order with this id, exclusive
     * @returns List of order details
     */
    async getListOfOrders(limit?: number, startingAfter?: string): Promise<List<GenericOrder>> {
        const params = [];
        if (limit) {
            params.push(`limit=${limit}`);
        }
        if (startingAfter) {
            params.push(`starting_after=${startingAfter}`);
        }

        const query = `?${params.join('&')}`;
        return await this.apiHandler.makeApiRequest<List<GenericOrder>>('get',
            `/orders${params.length > 0 ? query : ''}`, {}, 'json');
    }

    /**
     * See https://docs.cnaught.com/api/reference/#operation/SubmitOrder
     * Places an order for carbon offsets by specifying the amount of offsets (in kg) directly.
     * @param options Options for the order specifying amount of CO2 to offset, as well as other
     * optional properties
     * @returns Details of the placed order
     */
    async placeGenericOrder(options: GenericOrderOptions): Promise<GenericOrder> {
        options = this.filterNullOptions({
            ...(options || {})
        });

        return await this.apiHandler.makeApiRequest<GenericOrder>('post', '/orders',
            { 'Content-Type': 'application/json' }, 'json', options);
    }

    /**
     * See https://docs.cnaught.com/api/reference/#operation/SubmitRideOrder
     * Places an order for offsets for a vehicle ride.
     * @param options Options for the order specifying distance of ride, as well as other
     * optional properties
     * @returns Details of the placed order
     */
    async placeRideOrder(options: RideOrderOptions): Promise<RideOrder> {
        options = this.filterNullOptions({
            ...(options || {})
        });

        return await this.apiHandler.makeApiRequest<RideOrder>('post', '/orders/ride',
            { 'Content-Type': 'application/json' }, 'json', options);
    }

    protected filterNullOptions(options: {}): any {
        const filteredOptions: any = {};
        Object.keys(options).forEach((option) => {
            if (options[option] !== null && options[option] !== undefined) {
                filteredOptions[option] = options[option];
            }
        });
        return filteredOptions;
    }
}
