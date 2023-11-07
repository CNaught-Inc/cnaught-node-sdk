/* eslint-disable @typescript-eslint/ban-types */
import { ApiRequestHandler } from './api-request-handler.js';
import type {
    List,
    GenericOrder,
    GenericOrderOptions,
    RideOrderOptions,
    RideOrder,
    GenericQuoteParams,
    RideQuoteParams,
    OffsetsQuote,
    IdempotencyRequestOptions,
    SubaccountOptions,
    SubaccountRequestOptions,
    Subaccount,
    ImpactData,
    ImpactHostedPageConfig
} from './models/index.js';

export interface CNaughtApiClientOptions {
    /**
     * hostname of the server where api requests are made, defaults to "api.cnaught.com"
     */
    hostname?: string;
    /**
     * port on the server where api requests are made, defaults to 443
     */
    port?: string | number;

    /**
     * the api version to use (used to construct the URL for each API endpoint). Default and only
     * currently legal value is 'v1'.
     */
    apiVersion?: string;

    /**
     * User-defined fetch function. Has to be fully compatible with the Fetch API standard.
     * Can be used to provide a fetch function in environments where one is not globally available or where
     * a wrapper fetch function should be used (e.g. Next.js).
     */
    fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export interface ApiRequestOptions {
    /**
     * Allows changes to the Request for an API operation before it is sent to the server.
     * Should return the updated request.
     * Can be used to add framework specific options to the request (e.g. validation tags for Next.js).
     * @param request the request to be sent
     */
    extraRequestOptions?: Record<string, unknown>;
}

/**
 * Client which handles executing CNaught API requests.
 */
export class CNaughtApiClient {
    apiHandler: ApiRequestHandler;

    /**
     * @param apiKey API Key used to authenticate API requests
     * @param options (optional) optional configuration for how requests are sent to the API server
     */
    constructor(apiKey: string, options?: CNaughtApiClientOptions) {
        const baseUrl = new URL('https://api.cnaught.com/v1');
        if (options?.hostname) baseUrl.hostname = options.hostname;
        if (options?.port) baseUrl.port = options.port.toString();
        if (options?.apiVersion) baseUrl.pathname = options.apiVersion;

        this.apiHandler = new ApiRequestHandler(
            baseUrl.toString(),
            apiKey,
            options?.fetch || fetch
        );
    }

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetOrderById
     * Get details for a specific offset order
     * @param id Id of the order whose details are to be retrieved
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * @returns Order details
     */
    getOrderDetails = (
        id: string,
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<GenericOrder> =>
        this.apiHandler.makeApiGetRequest<GenericOrder>(
            `/orders/${id}`,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetListOfOrder
     * Get a list of offset orders in reverse chronological order
     * (last submitted first) up to the provided limit number of orders per call. Pagination is supported via passing
     * the last order id from previous call into starting_after.
     * @param limit (optional) maximum number of orders to retrieve, default is 100
     * @param startingAfter (optional) returns only orders created after the order with this id, exclusive
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * * @returns List of order details
     */
    getListOfOrders = async (
        limit?: number,
        startingAfter?: string,
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<List<GenericOrder>> => {
        const params = [];
        if (limit) {
            params.push(`limit=${limit}`);
        }
        if (startingAfter) {
            params.push(`starting_after=${startingAfter}`);
        }

        const query = `?${params.join('&')}`;
        return await this.apiHandler.makeApiGetRequest<List<GenericOrder>>(
            `/orders${params.length > 0 ? query : ''}`,
            requestOptions
        );
    };

    /**
     * See https://docs.cnaught.com/api/reference/#operation/SubmitOrder
     * Places an order for carbon offsets by specifying the amount of offsets (in kg) directly.
     * @param options Options for the order specifying amount of CO2 to offset, as well as other
     * optional properties
     * @param requestOptions Optional additional request options, for specifying an idempotency key
     * or subaccount to use, or transforming the request before sending
     * @returns Details of the placed order
     */
    placeGenericOrder = (
        options: GenericOrderOptions,
        requestOptions?: IdempotencyRequestOptions &
            SubaccountRequestOptions &
            ApiRequestOptions
    ): Promise<GenericOrder> =>
        this.apiHandler.makeApiPostRequest<GenericOrder>('/orders', {
            ...requestOptions,
            data: options
        });

    /**
     * See https://docs.cnaught.com/api/reference/#operation/SubmitRideOrder
     * Places an order for offsets for a vehicle ride.
     * @param options Options for the order specifying distance of ride, as well as other
     * optional properties
     * @param requestOptions Optional additional request options, for specifying an idempotency key
     * or subaccount to use, or transforming the request before sending
     * @returns Details of the placed order
     */
    placeRideOrder = (
        options: RideOrderOptions,
        requestOptions?: IdempotencyRequestOptions &
            SubaccountRequestOptions &
            ApiRequestOptions
    ): Promise<RideOrder> =>
        this.apiHandler.makeApiPostRequest<RideOrder>('/orders/ride', {
            ...requestOptions,
            data: options
        });

    /**
     * See https://docs.cnaught.com/api/reference/#operation/CancelOrder
     * Cancels a previously placed order for offsets.
     *
     * @param id Id of the order to be canceled
     * @param requestOptions Optional additional request options, for specifying an idempotency key
     * or subaccount to use, or transforming the request before sending
     * @returns Updated details of the order
     */
    cancelOrder = (
        id: string,
        requestOptions?: IdempotencyRequestOptions &
            SubaccountRequestOptions &
            ApiRequestOptions
    ): Promise<GenericOrder> =>
        this.apiHandler.makeApiPostRequest<GenericOrder>(
            `/orders/${id}/cancel`,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/RequestQuote
     * Gets a price quote for carbon offsets by specifying the amount of CO2 to offset (in kg) directly.
     * @param params Params for getting a generic offsets price quote
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * @returns The quote
     */
    getGenericQuote = (
        params: GenericQuoteParams,
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<OffsetsQuote> =>
        this.apiHandler.makeApiPostRequest<OffsetsQuote>('/quotes', {
            ...requestOptions,
            data: params
        });

    /**
     * See https://docs.cnaught.com/api/reference/#operation/RequestRideQuote
     * Gets a price quote for carbon offsets by specifying the amount of CO2 to offset (in kg) directly.
     * @param params Params for getting a price quote for offsetting a vehicle ride
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * @returns The quote
     */
    getRideQuote = (
        params: RideQuoteParams,
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<OffsetsQuote> =>
        this.apiHandler.makeApiPostRequest<OffsetsQuote>('/quotes/ride', {
            ...requestOptions,
            data: params
        });

    /**
     * See https://docs.cnaught.com/api/reference/#operation/CreateSubaccount
     * Creates a new subaccount under the user identified by the API key
     * @param options Options for the subaccount specifying name, default portfolio and other properties
     * @param requestOptions Optional additional request options, for specifying an idempotency key,
     * or transforming the request before sending
     * @returns Details of the created subaccount
     */
    createSubaccount = (
        options: SubaccountOptions,
        requestOptions?: IdempotencyRequestOptions & ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiPostRequest<Subaccount>('/subaccounts', {
            ...requestOptions,
            data: options
        });

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetSubaccountById
     * Get details for a subaccount
     * @param id Id of the subaccount whose details are to be retrieved
     * @param requestOptions Optional additional request options, e.g. for transforming the Request before sending
     * @returns Subaccount details
     */
    getSubaccountDetails = (
        id: string,
        requestOptions?: ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiGetRequest<Subaccount>(
            `/subaccounts/${id}`,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetListOfSubaccounts
     * Get a list of subaccounts in reverse chronological order
     * (last created first) up to the provided limit number of subaccounts per call. Pagination is supported via passing
     * the last subaccount id from previous call into starting_after.
     * @param limit (optional) maximum number of subaccounts to retrieve, default is 100
     * @param startingAfter (optional) returns only subaccounts created after the subaccount with this id, exclusive
     * @param requestOptions Optional additional request options, e.g. for transforming the Request before sending
     * @returns List of subaccount details
     */
    getListOfSubaccounts = async (
        limit?: number,
        startingAfter?: string,
        requestOptions?: ApiRequestOptions
    ): Promise<List<Subaccount>> => {
        const params = [];
        if (limit) {
            params.push(`limit=${limit}`);
        }
        if (startingAfter) {
            params.push(`starting_after=${startingAfter}`);
        }

        const query = `?${params.join('&')}`;
        return await this.apiHandler.makeApiGetRequest<List<Subaccount>>(
            `/subaccounts${params.length > 0 ? query : ''}`,
            requestOptions
        );
    };

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetImpactData
     * Get the impact data for the user identified by the API key (or a subaccount of the user)
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * @returns Impact data for user or subaccount
     */
    getImpactData = (
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<ImpactData> =>
        this.apiHandler.makeApiGetRequest<ImpactData>(
            '/impact/data',
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetImpactHostedPageConfig
     * Get the configuration for the hosted impact page for the user identified by the API key (or a subaccount of the user)
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * @returns Hosted impact page configuration for user or subaccount
     */
    getImpactHostedPageConfig = (
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<ImpactHostedPageConfig> =>
        this.apiHandler.makeApiGetRequest<ImpactHostedPageConfig>(
            '/impact/hosted-page-config',
            requestOptions
        );
}
