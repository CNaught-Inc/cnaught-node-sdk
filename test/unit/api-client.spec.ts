import { CNaughtApiClient } from '../../src/api-client.js';
import { ApiRequestHandler } from '../../src/api-request-handler.js';
import type {
    GenericOrderOptions,
    RideOrderOptions,
    GenericQuoteParams,
    RideQuoteParams,
    SubaccountOptions,
    Subaccount,
    ImpactData,
    ImpactHostedPageConfig
} from '../../src/models/index.js';

import { jest } from '@jest/globals';

const mockMakeApiGetRequest: jest.Mock<ApiRequestHandler['makeApiGetRequest']> =
    jest.fn();
const mockMakeApiPostRequest: jest.Mock<
    ApiRequestHandler['makeApiGetRequest']
> = jest.fn();

jest.mock('../../src/api-request-handler.js', () => {
    return {
        ApiRequestHandler: jest.fn().mockImplementation(() => {
            return {
                makeApiGetRequest: mockMakeApiGetRequest,
                makeApiPostRequest: mockMakeApiPostRequest
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

    const quote = {
        amount_kg: 20.5,
        price_usd_cents: 10
    };

    const subaccountId = 'subaccount-id';
    const otherSubaccountId = 'subaccount-id-2';
    const subaccountDetails: Subaccount = {
        id: subaccountId,
        name: 'My subaccount',
        default_portfolio_id: 'ABC'
    };

    const impactData: ImpactData = {
        name: 'My company',
        total_offset_kgs: 10,
        logo_url: 'https://example.com',
        since_date: '2022-08-05T24:00:00.29Z',
        equivalents: {
            cars_off_the_road: 1,
            flights_lax_to_nyc: 2,
            homes_annual_energy_usage: 3,
            trees_planted: 4
        },
        categories: [
            {
                category: {
                    id: 'XYZ',
                    name: 'Category 1'
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

    beforeEach(() => {
        mockMakeApiPostRequest.mockClear();
        mockMakeApiGetRequest.mockClear();
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

    describe('placeGenericOrder', () => {
        it('place order ', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeGenericOrder(options);

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

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15,
                portfolio_id: 'XYZ'
            };

            const order = await sut.placeGenericOrder(options);

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

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeGenericOrder(options, {
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

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeGenericOrder(options, {
                subaccountId: 'XYZ'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith('/orders', options, {
                subaccountId: 'XYZ'
            });
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    describe('placeRideOrder', () => {
        it('place ride order ', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 12.2
            };

            const order = await sut.placeRideOrder(options);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/ride',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place ride order with portfolio id', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 12.2,
                portfolio_id: 'XYZ'
            };

            const order = await sut.placeRideOrder(options);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/ride',
                options,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place ride order with idempotency', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 15
            };

            const order = await sut.placeRideOrder(options, {
                idempotencyKey: 'ABCD'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/ride',
                options,
                {
                    idempotencyKey: 'ABCD'
                }
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place ride order with idempotency and subaccount', async () => {
            mockMakeApiPostRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 15
            };

            const order = await sut.placeRideOrder(options, {
                idempotencyKey: 'ABCD',
                subaccountId: 'XYZ'
            });

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/orders/ride',
                options,
                {
                    idempotencyKey: 'ABCD',
                    subaccountId: 'XYZ'
                }
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    describe('getGenericQuote', () => {
        it('get quote', async () => {
            mockMakeApiPostRequest.mockResolvedValue(quote);

            const params: GenericQuoteParams = {
                amount_kg: 15
            };

            const result = await sut.getGenericQuote(params);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/quotes',
                params,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });

        it('get quote with portfolio id', async () => {
            mockMakeApiPostRequest.mockResolvedValue(quote);

            const params: GenericQuoteParams = {
                amount_kg: 15,
                portfolio_id: 'XYZ'
            };

            const result = await sut.getGenericQuote(params);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/quotes',
                params,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });
    });

    describe('getRideQuote', () => {
        it('get quote', async () => {
            mockMakeApiPostRequest.mockResolvedValue(quote);

            const params: RideQuoteParams = {
                distance_km: 10
            };

            const result = await sut.getRideQuote(params);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/quotes/ride',
                params,
                undefined
            );
            expect(mockMakeApiPostRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });

        it('get quote with portfolio id', async () => {
            mockMakeApiPostRequest.mockResolvedValue(quote);

            const params: RideQuoteParams = {
                distance_km: 10,
                portfolio_id: 'XYZ'
            };

            const result = await sut.getRideQuote(params);

            expect(mockMakeApiPostRequest).toBeCalledWith(
                '/quotes/ride',
                params,
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

            const options: SubaccountOptions = {
                name: 'My Company',
                default_portfolio_id: 'XYZ'
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

            const options: SubaccountOptions = {
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
});
