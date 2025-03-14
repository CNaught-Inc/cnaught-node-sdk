import { CNaughtApiClient } from '../../src/api-client.js';
import { ApiRequestHandler } from '../../src/api-request-handler.js';
import type {
    OrderByAmountOptions,
    CreateSubaccountOptions,
    UpdateSubaccountOptions,
    Subaccount,
    ImpactData,
    ImpactHostedPageConfig,
    Project,
    ProjectCategoryWithProjects,
    PortfolioWithCategoryAllocations,
    Portfolio,
    List,
    SubaccountLogoUrlOptions,
    SubaccountLogoFileOptions,
    OrderByPriceOptions
} from '../../src/models/index.js';

import { jest } from '@jest/globals';

const mockMakeApiGetRequest: jest.Mock<ApiRequestHandler['makeApiGetRequest']> =
    jest.fn();
const mockMakeApiPostRequest: jest.Mock<
    ApiRequestHandler['makeApiPostRequest']
> = jest.fn();
const mockMakeApiPutRequest: jest.Mock<ApiRequestHandler['makeApiPutRequest']> =
    jest.fn();
const mockMakeApiDeleteRequest: jest.Mock<
    ApiRequestHandler['makeApiDeleteRequest']
> = jest.fn();

jest.mock('../../src/api-request-handler.js', () => {
    return {
        ApiRequestHandler: jest.fn().mockImplementation(() => {
            return {
                makeApiGetRequest: mockMakeApiGetRequest,
                makeApiPostRequest: mockMakeApiPostRequest,
                makeApiPutRequest: mockMakeApiPutRequest,
                makeApiDeleteRequest: mockMakeApiDeleteRequest
            };
        })
    };
});

describe('api-client', () => {
    let sut: CNaughtApiClient;

    const orderId = 'ABCDEF';
    const otherOrderId = 'XYZZYX';
    const orderDetails = {
        id: orderId,
        state: 'placed',
        created_on: '2022-08-05T24:00:00.29Z',
        callback_url: 'https://www.example.com/callback'
    };

    const fulfilledOrderDetails = {
        id: orderId,
        state: 'fulfilled',
        created_on: '2022-08-05T24:00:00.29Z',
        callback_url: 'https://www.example.com/callback',
        project_allocations: [
            {
                project: {
                    name: 'Test Project',
                    developer: 'Test Developer'
                },
                amount_kg: 2000,
                retirements: [
                    {
                        serial_number_range: 'SN123',
                        url: 'http://example.com/SN123'
                    }
                ]
            }
        ]
    };

    const checkoutSessionId = 'ABCDEF';
    const checkoutSession = {
        id: checkoutSessionId,
        checkout_url: 'https://www.example.com/checkout',
        state: 'open',
        amount_kg: 1000,
        price_usd_cents: 2000
    };

    const quote = {
        amount_kg: 20.5,
        price_usd_cents: 10
    };

    const subaccountId = 'subaccount-id';
    const otherSubaccountId = 'subaccount-id-2';
    const subaccountDetails: Subaccount = {
        id: subaccountId,
        name: 'My subaccount',
        created_on: '2023-11-13T18:33:58.494127Z',
        default_portfolio_id: 'ABC',
        logo_url: 'http://example.com/image.png'
    };

    const impactData: ImpactData = {
        name: 'My company',
        total_offset_kgs: 10,
        logo_url: 'https://example.com',
        since_date: '2022-08-05T24:00:00.29Z',
        to_date: null,
        equivalents: {
            cars_off_the_road: 1,
            flights_lax_to_nyc: 2,
            homes_annual_energy_usage: 3,
            trees_planted: 4
        },
        categories: [
            {
                category: {
                    name: 'Category 1',
                    description: 'Category 1 description'
                },
                offset_kgs: 10,
                projects: [
                    {
                        project: {
                            id: 'XYZ',
                            name: 'Some project',
                            type: 'ARR',
                            un_sdg_goals: []
                        },
                        offset_kgs: 10,
                        vintages: '2012'
                    }
                ]
            }
        ]
    };

    const impactHostedPageConfig: ImpactHostedPageConfig = {
        enabled: true,
        enabled_equivalents: ['homes', 'cars'],
        url: 'https://example.com'
    };

    const projectId = 'project-id';
    const projectDetails: Project = {
        id: projectId,
        name: 'Some project',
        type: 'ARR',
        un_sdg_goals: [],
        developer: 'Test Developer',
        activity_types: ['Test Activity'],
        summary: 'Test Summary',
        description: 'Test Description',
        verifier: 'Test Verifier',
        lifetime: {
            start_year: 2021,
            end_year: 2024
        },
        impact_type: 'Avoided Emissions',
        beyond_carbon: 'Test Beyond Carbon',
        due_diligence: 'Test Due Diligence',
        location_name: 'Test Location',
        methodology: 'Test Methodology',
        permanence: 'Test Permanence',
        news_articles: [
            {
                title: 'Test title',
                url: 'https://example.com',
                author: 'Test Author',
                published_on: '2022-08-05T24:00:00.29Z',
                cnaught_take: 'Our take'
            }
        ]
    };

    const projectCategoryId = 'project-category-id';
    const projectCategoryDetails: ProjectCategoryWithProjects = {
        id: projectCategoryId,
        name: 'Some project category',
        description: 'Text description',
        primary_image_url: 'http://example.org/image',
        projects: [projectDetails]
    };

    const portfolioId = 'portfolio-id';
    const portfolioDetails: PortfolioWithCategoryAllocations = {
        id: portfolioId,
        name: 'Some portfolio',
        summary: 'Some summary',
        description: 'Some description',
        primary_image_url: 'http://example.org/image',
        checkout_price_per_kg_usd_cents: 2,
        api_price_per_kg_usd_cents: 2.5,
        category_allocations: [
            {
                category: projectCategoryDetails,
                allocated_fraction: 1.0
            }
        ]
    };

    beforeEach(() => {
        mockMakeApiPostRequest.mockClear();
        mockMakeApiGetRequest.mockClear();
        mockMakeApiPutRequest.mockClear();
        mockMakeApiDeleteRequest.mockClear();
        sut = new CNaughtApiClient('apikey');
    });

    describe('getOrderDetails', () => {
        it('get order by id', async () => {
            mockMakeApiGetRequest.mockResolvedValue(fulfilledOrderDetails);

            const order = await sut.getOrderDetails(orderId);

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/orders/${orderDetails.id}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(order).toEqual(fulfilledOrderDetails);
        });

        it('get order by id for subaccount', async () => {
            mockMakeApiGetRequest.mockResolvedValue(fulfilledOrderDetails);

            const order = await sut.getOrderDetails(orderId, {
                subaccountId: 'ABC'
            });

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/orders/${orderDetails.id}`,
                { subaccountId: 'ABC' }
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(order).toEqual(fulfilledOrderDetails);
        });
    });

    describe('getListOfOrders', () => {
        it('get list of orders', async () => {
            mockMakeApiGetRequest.mockResolvedValue([orderDetails]);

            const orders = await sut.getListOfOrders();

            expect(orders).toEqual([orderDetails]);
            expect(mockMakeApiGetRequest).toBeCalledWith('/orders', undefined);
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of orders for subaccount', async () => {
            mockMakeApiGetRequest.mockResolvedValue([orderDetails]);

            const orders = await sut.getListOfOrders(undefined, undefined, {
                subaccountId: 'XYZ'
            });

            expect(orders).toEqual([orderDetails]);
            expect(mockMakeApiGetRequest).toBeCalledWith('/orders', {
                subaccountId: 'XYZ'
            });
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of orders with limit of 5', async () => {
            const orderDetails2 = {
                id: otherOrderId,
                status: 'fulfilled',
                created_on: '2022-08-05T23:23:22.29Z'
            };
            const data = [orderDetails, orderDetails2];
            mockMakeApiGetRequest.mockResolvedValue(data);

            const orders = await sut.getListOfOrders(5, undefined);

            expect(orders).toEqual([orderDetails, orderDetails2]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                '/orders?limit=5',
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of orders starting after certain order id', async () => {
            mockMakeApiGetRequest.mockResolvedValue([orderDetails]);

            const orders = await sut.getListOfOrders(undefined, otherOrderId);

            expect(orders).toEqual([orderDetails]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/orders?starting_after=${otherOrderId}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of orders with limit of 5 and starting after certain order id', async () => {
            const limit = 5;
            const orderDetails2 = {
                id: otherOrderId,
                status: 'cancelled',
                created_on: '2022-05-05T23:23:22.29Z'
            };
            mockMakeApiGetRequest.mockResolvedValue([
                orderDetails,
                orderDetails2
            ]);

            const orders = await sut.getListOfOrders(limit, otherOrderId);

            expect(orders).toEqual([orderDetails, orderDetails2]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/orders?limit=${limit}&starting_after=${otherOrderId}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });
    });

    describe('placeOrder', () => {
        it('place order with amount', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: OrderByAmountOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeOrder(options);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order with price', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: OrderByPriceOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                total_price_usd_cents: 3200
            };

            const order = await sut.placeOrder(options);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order with portfolio id', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: OrderByAmountOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15,
                portfolio_id: 'XYZ'
            };

            const order = await sut.placeOrder(options);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order with idempotency', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: OrderByAmountOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeOrder(options, {
                idempotencyKey: 'ABCD'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith('/orders', options, {
                idempotencyKey: 'ABCD'
            });
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order for subaccount', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: OrderByAmountOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeOrder(options, {
                subaccountId: 'XYZ'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith('/orders', options, {
                subaccountId: 'XYZ'
            });
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    describe.each([
        ['getGenericQuote', { amount_kg: 15 }, '/quotes'],
        [
            'getAirFreightQuote',
            { freight_mass_kg: 25, distance_km: 15 },
            '/quotes/air-freight'
        ],
        ['getFlightQuote', { distance_km: 15 }, '/quotes/flight'],
        [
            'getGroundFreightQuote',
            { freight_mass_kg: 25, distance_km: 15 },
            '/quotes/ground-freight'
        ],
        [
            'getGroundTransportQuote',
            { distance_km: 15, vehicle_type: 'school_bus' },
            '/quotes/ground-transport'
        ],
        ['getOfficeSpaceQuote', { square_footage: 15 }, '/quotes/office-space'],
        ['getTrainQuote', { distance_km: 15 }, '/quotes/train']
    ])('%s', (apiFnName: string, params: any, apiEndpoint: string) => {
        it('get quote', async () => {
            mockMakeApiPostRequest.mockResolvedValue(quote);

            const result = await sut[apiFnName](params);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                apiEndpoint,
                params,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });

        it('get quote with portfolio id', async () => {
            mockMakeApiPostRequest.mockResolvedValue(quote);

            const paramsWithPortfolioId = {
                ...params,
                portfolio_id: 'XYZ'
            };

            const result = await sut.getGenericQuote(paramsWithPortfolioId);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/quotes',
                paramsWithPortfolioId,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });
    });

    describe('cancelOrder', () => {
        it('cancel order ', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const order = await sut.cancelOrder('123');

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/123/cancel',
                null,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('cancel order with idempotency', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const order = await sut.cancelOrder('123', {
                idempotencyKey: 'ABCD'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/123/cancel',
                null,
                { idempotencyKey: 'ABCD' }
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('cancel order with idempotency and subaccount', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const order = await sut.cancelOrder('123', {
                idempotencyKey: 'ABCD',
                subaccountId: 'XYZ'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/123/cancel',
                null,
                { idempotencyKey: 'ABCD', subaccountId: 'XYZ' }
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    it('createCheckoutSession', async () => {
        mockMakeApiPostRequest.mockResolvedValue(checkoutSession);

        const opts = {
            amount_kg: 1000,
            success_url: 'https://www.example.com',
            cancel_url: 'https://www.example.com'
        };

        const session = await sut.createCheckoutSession(opts);

        expect(mockMakeApiPostRequest).toBeCalledWith(
            '/checkout/sessions',
            opts,
            undefined
        );
        expect(mockMakeApiPostRequest).toBeCalledTimes(1);
        expect(session).toEqual(checkoutSession);
    });

    it('getCheckoutSession', async () => {
        mockMakeApiGetRequest.mockResolvedValue(checkoutSession);

        const session = await sut.getCheckoutSession(checkoutSessionId);

        expect(mockMakeApiGetRequest).toBeCalledWith(
            `/checkout/sessions/${checkoutSessionId}`,
            undefined
        );
        expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        expect(session).toEqual(checkoutSession);
    });

    describe('getSubaccountDetails', () => {
        it('get subaccount by id', async () => {
            mockMakeApiGetRequest.mockResolvedValue(subaccountDetails);

            const subaccount = await sut.getSubaccountDetails(subaccountId);

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/subaccounts/${subaccount.id}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('getListOfSubaccounts', () => {
        it('get list of subaccounts', async () => {
            mockMakeApiGetRequest.mockResolvedValue([subaccountDetails]);

            const subaccounts = await sut.getListOfSubaccounts();

            expect(subaccounts).toEqual([subaccountDetails]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                '/subaccounts',
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of subaccounts with limit of 5', async () => {
            const subaccountsDetails2: Subaccount = {
                id: otherSubaccountId,
                created_on: '2023-11-13T18:33:58.494127Z',
                name: 'Other subaccount'
            };
            const data = [subaccountDetails, subaccountsDetails2];
            mockMakeApiGetRequest.mockResolvedValue(data);

            const subaccounts = await sut.getListOfSubaccounts(5, undefined);

            expect(subaccounts).toEqual([
                subaccountDetails,
                subaccountsDetails2
            ]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                '/subaccounts?limit=5',
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of subaccounts starting after certain subaccount id', async () => {
            mockMakeApiGetRequest.mockResolvedValue([subaccountDetails]);

            const subaccounts = await sut.getListOfSubaccounts(
                undefined,
                otherSubaccountId
            );

            expect(subaccounts).toEqual([subaccountDetails]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/subaccounts?starting_after=${otherSubaccountId}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });

        it('get list of subaccounts with limit of 5 and starting after certain subaccount id', async () => {
            const limit = 5;
            const subaccountsDetails2: Subaccount = {
                id: otherSubaccountId,
                created_on: '2023-11-13T18:33:58.494127Z',
                name: 'Other subaccount'
            };
            const data = [subaccountDetails, subaccountsDetails2];
            mockMakeApiGetRequest.mockResolvedValue(data);

            const subaccounts = await sut.getListOfSubaccounts(
                limit,
                otherSubaccountId
            );

            expect(subaccounts).toEqual([
                subaccountDetails,
                subaccountsDetails2
            ]);
            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/subaccounts?limit=${limit}&starting_after=${otherSubaccountId}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });
    });

    describe('createSubaccount', () => {
        it('create subaccount', async () => {
            mockMakeApiPostRequest.mockResolvedValue(subaccountDetails);

            const options: CreateSubaccountOptions = {
                name: 'My Company',
                default_portfolio_id: 'XYZ',
                logo_url: 'http://example.com/image.png'
            };

            const subaccount = await sut.createSubaccount(options);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/subaccounts',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });

        it('create subaccount with idempotency', async () => {
            mockMakeApiPostRequest.mockResolvedValue(subaccountDetails);

            const options: CreateSubaccountOptions = {
                name: 'My Company',
                default_portfolio_id: 'XYZ'
            };

            const subaccount = await sut.createSubaccount(options, {
                idempotencyKey: 'ABCD'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/subaccounts',
                options,
                {
                    idempotencyKey: 'ABCD'
                }
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('updateSubaccount', () => {
        it('update subaccount', async () => {
            mockMakeApiPutRequest.mockResolvedValue(subaccountDetails);

            const subaccountId = 'ABC';
            const options: UpdateSubaccountOptions = {
                name: 'My Company',
                default_portfolio_id: 'XYZ'
            };

            const subaccount = await sut.updateSubaccount(
                subaccountId,
                options
            );

            expect(mockMakeApiPutRequest).toBeCalledWith(
                '/subaccounts/ABC',
                options,
                undefined
            );
            expect(mockMakeApiPutRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('updateSubaccountLogoFromUrl', () => {
        it('update subaccount logo from url', async () => {
            mockMakeApiPutRequest.mockResolvedValue(subaccountDetails);

            const subaccountId = 'ABC';
            const options: SubaccountLogoUrlOptions = {
                logo_url: 'http://example.com/new.png'
            };

            const subaccount = await sut.updateSubaccountLogoFromUrl(
                subaccountId,
                options
            );

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/subaccounts/ABC/logo',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('updateSubaccountFromImageData', () => {
        it('update subaccount from file', async () => {
            mockMakeApiPutRequest.mockResolvedValue(subaccountDetails);

            const subaccountId = 'ABC';
            const options: SubaccountLogoFileOptions = {
                logo_file_content: 'image data',
                content_type: 'image/jpeg'
            };

            const subaccount = await sut.updateSubaccountLogoFromImageData(
                subaccountId,
                options
            );

            expect(mockMakeApiPutRequest).toBeCalledWith(
                '/subaccounts/ABC/logo',
                'image data',
                {
                    extraRequestOptions: {
                        duplex: 'half'
                    },
                    headers: {
                        'Content-Type': 'image/jpeg'
                    }
                }
            );
            expect(mockMakeApiPutRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('removeSubaccountLogo', () => {
        it('remove subaccount logo', async () => {
            mockMakeApiDeleteRequest.mockResolvedValue(subaccountDetails);

            const subaccountId = 'ABC';

            const subaccount = await sut.removeSubaccountLogo(subaccountId);

            expect(mockMakeApiDeleteRequest).toBeCalledWith(
                '/subaccounts/ABC/logo',
                undefined
            );
            expect(mockMakeApiDeleteRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('deleteSubaccount', () => {
        it('delete subaccount', async () => {
            mockMakeApiDeleteRequest.mockResolvedValue(undefined);

            const subaccountId = 'ABC';

            await sut.deleteSubaccount(subaccountId);

            expect(mockMakeApiDeleteRequest).toBeCalledWith(
                '/subaccounts/ABC',
                undefined
            );
            expect(mockMakeApiDeleteRequest).toBeCalledTimes(1);
        });

        it('delete subaccount with request options', async () => {
            mockMakeApiDeleteRequest.mockResolvedValue(undefined);

            const subaccountId = 'ABC';
            const requestOptions = {
                extraRequestOptions: { cache: 'no-store' }
            };

            await sut.deleteSubaccount(subaccountId, requestOptions);

            expect(mockMakeApiDeleteRequest).toBeCalledWith(
                '/subaccounts/ABC',
                requestOptions
            );
            expect(mockMakeApiDeleteRequest).toBeCalledTimes(1);
        });
    });

    describe('getImpactData', () => {
        it('get impact data', async () => {
            mockMakeApiGetRequest.mockResolvedValue(impactData);

            const res = await sut.getImpactData();

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/impact/data`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactData);
        });

        it('get impact data with date filter', async () => {
            mockMakeApiGetRequest.mockResolvedValue(impactData);

            const res = await sut.getImpactData({
                from: new Date(Date.UTC(2024, 0, 1)),
                to: new Date(Date.UTC(2024, 11, 31))
            });

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/impact/data?from=2024-01-01T00:00:00.000Z&to=2024-12-31T00:00:00.000Z`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactData);
        });

        it('get impact data with subaccount', async () => {
            mockMakeApiGetRequest.mockResolvedValue(impactData);

            const res = await sut.getImpactData(undefined, {
                subaccountId: 'ABC'
            });

            expect(mockMakeApiGetRequest).toBeCalledWith('/impact/data', {
                subaccountId: 'ABC'
            });
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactData);
        });

        it('get impact data with date filter and subaccount', async () => {
            mockMakeApiGetRequest.mockResolvedValue(impactData);

            const res = await sut.getImpactData(
                {
                    from: new Date(Date.UTC(2024, 0, 1)),
                    to: new Date(Date.UTC(2024, 11, 31))
                },
                { subaccountId: 'ABC' }
            );

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/impact/data?from=2024-01-01T00:00:00.000Z&to=2024-12-31T00:00:00.000Z`,
                { subaccountId: 'ABC' }
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactData);
        });
    });

    describe('getImpactHostedPageConfig', () => {
        it('get impact hosted page config', async () => {
            mockMakeApiGetRequest.mockResolvedValue(impactHostedPageConfig);

            const res = await sut.getImpactHostedPageConfig();

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/impact/hosted-page-config`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactHostedPageConfig);
        });
    });

    describe('getProjectDetails', () => {
        it('get project by id', async () => {
            mockMakeApiGetRequest.mockResolvedValue(projectDetails);

            const project = await sut.getProjectDetails(projectId);

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/projects/${projectDetails.id}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(project).toEqual(projectDetails);
        });
    });

    describe('getProjectCategoryDetails', () => {
        it('get project category by id', async () => {
            mockMakeApiGetRequest.mockResolvedValue(projectCategoryDetails);

            const projectCategory = await sut.getProjectCategoryDetails(
                projectCategoryId
            );

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/project-categories/${projectCategoryDetails.id}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(projectCategory).toEqual(projectCategoryDetails);
        });
    });

    describe('getPortfolioDetails', () => {
        it('get portfolio by id', async () => {
            mockMakeApiGetRequest.mockResolvedValue(portfolioDetails);

            const portfolio = await sut.getPortfolioDetails(portfolioId);

            expect(mockMakeApiGetRequest).toBeCalledWith(
                `/portfolios/${portfolio.id}`,
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
            expect(portfolio).toEqual(portfolioDetails);
        });
    });

    describe('getListOfPortfolios', () => {
        it('get list of portfolios', async () => {
            mockMakeApiGetRequest.mockResolvedValue({
                data: [portfolioDetails]
            } satisfies List<Portfolio>);

            const portfolios = await sut.getListOfPortfolios();

            expect(portfolios).toEqual({ data: [portfolioDetails] });
            expect(mockMakeApiGetRequest).toBeCalledWith(
                '/portfolios',
                undefined
            );
            expect(mockMakeApiGetRequest).toBeCalledTimes(1);
        });
    });
});
