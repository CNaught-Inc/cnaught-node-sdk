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
    CreateSubaccountOptions,
    SubaccountRequestOptions,
    Subaccount,
    ImpactData,
    ImpactHostedPageConfig,
    Project,
    ProjectCategoryWithProjects,
    Portfolio,
    PortfolioWithCategoryAllocations,
    UpdateSubaccountOptions,
    SubaccountLogoFileOptions,
    SubaccountLogoUrlOptions,
    ImpactDateFilterOptions
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
        this.apiHandler.makeApiPostRequest<GenericOrder>(
            '/orders',
            options,
            requestOptions
        );

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
        this.apiHandler.makeApiPostRequest<RideOrder>(
            '/orders/ride',
            options,
            requestOptions
        );

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
            null,
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
        this.apiHandler.makeApiPostRequest<OffsetsQuote>(
            '/quotes',
            params,
            requestOptions
        );

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
        this.apiHandler.makeApiPostRequest<OffsetsQuote>(
            '/quotes/ride',
            params,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/CreateSubaccount
     * Creates a new subaccount under the user identified by the API key
     * @param options Options for the subaccount specifying name, default portfolio and other properties
     * @param requestOptions Optional additional request options, for specifying an idempotency key,
     * or transforming the request before sending
     * @returns Details of the created subaccount
     */
    createSubaccount = (
        options: CreateSubaccountOptions,
        requestOptions?: IdempotencyRequestOptions & ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiPostRequest<Subaccount>(
            '/subaccounts',
            options,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/UpdateSubaccount
     * Updates the subaccount with given id under the user identified by the API key.
     * This does not include updating the logo: there are separate methods for doing so.
     * @param id ID of the subaccount to update.
     * @param options Properties of the subaccount to update, eg name, default portfolio.
     * The update options should include all properties of the subaccount (except for logo) -
     * not including the default portfolio id will have the effect of making the subaccount not
     * have an explicit default portfolio (making it inherit the default portfolio from the parent user).
     * @param requestOptions Optional additional request options, for transforming the request before sending
     * @returns Details of the updated subaccount after applying the update
     */
    updateSubaccount = (
        id: string,
        options: UpdateSubaccountOptions,
        requestOptions?: ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiPutRequest<Subaccount>(
            `/subaccounts/${id}`,
            options,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/UpdateSubaccountLogoFromURL
     * Update the logo for the subaccount with given id under the user identified by the API key by
     * downloading it from the URL provided in the options.
     * @param id ID of the subaccount whose logo should be updated.
     * @param logoOptions Options for specifying the URL to download the logo from.
     * The URL should point to a valid image in a supported image format, and should include
     * the content type for the image in the HTTP response when the image is retrieved from the URL.
     * @param requestOptions Optional additional request options, for transforming the request before sending
     * @returns Details of the updated subaccount after updating the logo
     */
    updateSubaccountLogoFromUrl = (
        id: string,
        logoOptions: SubaccountLogoUrlOptions,
        requestOptions?: ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiPostRequest<Subaccount>(
            `/subaccounts/${id}/logo`,
            logoOptions,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/UpdateSubaccountLogoFromUpload
     * Update the logo for the subaccount with given id under the user identified by the API key by
     * uploading the image data for the logo provided in options.
     * @param id ID of the subaccount whose logo should be updated.
     * @param options Options for the new logo content.
     * The logo_file_content property of this options object can be any object that is a valid value for the body of a fetch request.
     * The content_type property of this options object must specify the image content type and must be a supported image type.
     * @param requestOptions Optional additional request options, for transforming the request before sending
     * @returns Details of the updated subaccount after updating the logo
     */
    updateSubaccountLogoFromImageData = (
        id: string,
        options: SubaccountLogoFileOptions,
        requestOptions?: ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiPutRequest<Subaccount>(
            `/subaccounts/${id}/logo`,
            options.logo_file_content,
            {
                ...requestOptions,
                ...(options.content_type && {
                    headers: { 'Content-Type': options.content_type }
                }),
                extraRequestOptions: {
                    duplex: 'half',
                    ...requestOptions?.extraRequestOptions
                }
            }
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/RemoveSubaccountLogo
     * Removes the logo for a subaccount with given id under the user identified by the API key
     * @param id ID of the subaccount whose logo should be updated.
     * @param requestOptions Optional additional request options, for transforming the request before sending
     * @returns Details of the updated subaccount after removing the logo.
     */
    removeSubaccountLogo = (
        id: string,
        requestOptions?: ApiRequestOptions
    ): Promise<Subaccount> =>
        this.apiHandler.makeApiDeleteRequest<Subaccount>(
            `/subaccounts/${id}/logo`,
            requestOptions
        );

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
     * @param filterOptions optional parameters for filtering the impact data by date range
     * @param requestOptions Optional additional request options, e.g. for specifying a subaccount to use
     * or transforming the Request before sending
     * @returns Impact data for user or subaccount
     */
    getImpactData = async (
        filterOptions?: ImpactDateFilterOptions,
        requestOptions?: SubaccountRequestOptions & ApiRequestOptions
    ): Promise<ImpactData> => {
        const params = [];
        if (filterOptions?.from) {
            params.push(`from=${filterOptions.from.toISOString()}`);
        }
        if (filterOptions?.to) {
            params.push(`to=${filterOptions.to.toISOString()}`);
        }

        return await this.apiHandler.makeApiGetRequest<ImpactData>(
            `/impact/data${params.length > 0 ? `?${params.join('&')}` : ''}`,
            requestOptions
        );
    };

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

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetProjectById
     * Get details for a project
     * @param id Id of the project whose details are to be retrieved
     * @param requestOptions Optional additional request options, e.g. for transforming the Request before sending
     * @returns Project details
     */
    getProjectDetails = (
        id: string,
        requestOptions?: ApiRequestOptions
    ): Promise<Project> =>
        this.apiHandler.makeApiGetRequest<Project>(
            `/projects/${id}`,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetProjectCategoryById
     * Get details for a project category
     * @param id Id of the project category whose details are to be retrieved
     * @param requestOptions Optional additional request options, e.g. for transforming the Request before sending
     * @returns Project category details
     */
    getProjectCategoryDetails = (
        id: string,
        requestOptions?: ApiRequestOptions
    ): Promise<ProjectCategoryWithProjects> =>
        this.apiHandler.makeApiGetRequest<ProjectCategoryWithProjects>(
            `/project-categories/${id}`,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetPortfolioById
     * Get details for a portfolio
     * @param id Id of the portfolio whose details are to be retrieved
     * @param requestOptions Optional additional request options, e.g. for transforming the Request before sending
     * @returns Portfolio details
     */
    getPortfolioDetails = (
        id: string,
        requestOptions?: ApiRequestOptions
    ): Promise<PortfolioWithCategoryAllocations> =>
        this.apiHandler.makeApiGetRequest<PortfolioWithCategoryAllocations>(
            `/portfolios/${id}`,
            requestOptions
        );

    /**
     * See https://docs.cnaught.com/api/reference/#operation/GetListOfPortfolios
     * Get the list of portfolios the user has access to
     * @param requestOptions Optional additional request options, e.g. for transforming the Request before sending
     * @returns List of portfolios
     */
    getListOfPortfolios = (
        requestOptions?: ApiRequestOptions
    ): Promise<List<Portfolio>> =>
        this.apiHandler.makeApiGetRequest<List<Portfolio>>(
            `/portfolios`,
            requestOptions
        );
}
