import { CNaughtApiClient } from '../../../src/api-client';
import { ApiRequestHandler } from '../../../src/api-request-handler';
import { GenericOrderOptions } from '../../../src/models/GenericOrderOptions';
import { RideOrderOptions } from '../../../src/models/RideOrderOptions';
import { GenericQuoteParams } from '../../../src/models/GenericQuoteParams';
import { RideQuoteParams } from '../../../src/models/RideQuoteParams';
import { Subaccount } from '../../../src/models/Subaccount';
import { ImpactData } from '../../../src/models/ImpactData';
import { ImpactHostedPageConfig } from '../../../src/models/ImpactHostedPageConfig';
import { SubaccountOptions } from '../../../src/models/SubaccountOptions';

jest.mock('../../../src/api-request-handler');

describe('api-client', () => {
    let sut: CNaughtApiClient;
    let mockMakeApiRequest: jest.Mock;

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
        enabled_sections: ['homes', 'cars'],
        url: 'https://example.com'
    };

    beforeEach(() => {
        mockMakeApiRequest = jest.fn();
        (ApiRequestHandler as jest.Mock<ApiRequestHandler>).mockImplementationOnce(() => ({
            makeApiRequest: mockMakeApiRequest
        }));
        sut = new CNaughtApiClient('apikey');
    });

    describe('getOrderDetails', () => {
        it('get order by id', async () => {
            mockMakeApiRequest.mockResolvedValue(fulfilledOrderDetails);

            const order = await sut.getOrderDetails(orderId);

            expect(mockMakeApiRequest).toBeCalledWith('get', `/orders/${orderDetails.id}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(fulfilledOrderDetails);
        });

        it('get order by id for subaccount', async () => {
            mockMakeApiRequest.mockResolvedValue(fulfilledOrderDetails);

            const order = await sut.getOrderDetails(orderId, { subaccountId: 'ABC'});

            expect(mockMakeApiRequest).toBeCalledWith('get', `/orders/${orderDetails.id}`, { 'X-Subaccount-Id': 'ABC' }, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(fulfilledOrderDetails);
        });
    });

    describe('getListOfOrders', () => {
        it('get list of orders', async () => {
            mockMakeApiRequest.mockResolvedValue([orderDetails]);

            const orders = await sut.getListOfOrders();

            expect(orders).toEqual([orderDetails]);
            expect(mockMakeApiRequest).toBeCalledWith('get', '/orders', {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of orders for subaccount', async () => {
            mockMakeApiRequest.mockResolvedValue([orderDetails]);

            const orders = await sut.getListOfOrders(undefined, undefined, { subaccountId: 'XYZ'});

            expect(orders).toEqual([orderDetails]);
            expect(mockMakeApiRequest).toBeCalledWith('get', '/orders', { 'X-Subaccount-Id': 'XYZ' }, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of orders with limit of 5', async () => {
            const orderDetails2 = {
                id: otherOrderId,
                status: 'fulfilled',
                created_on: '2022-08-05T23:23:22.29Z'
            };
            const data = [orderDetails, orderDetails2];
            mockMakeApiRequest.mockResolvedValue(data);

            const orders = await sut.getListOfOrders(5);

            expect(orders).toEqual([orderDetails, orderDetails2]);
            expect(mockMakeApiRequest).toBeCalledWith('get', '/orders?limit=5', {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of orders starting after certain order id', async () => {
            mockMakeApiRequest.mockResolvedValue([orderDetails]);

            const orders = await sut.getListOfOrders(undefined, otherOrderId);

            expect(orders).toEqual([orderDetails]);
            expect(mockMakeApiRequest).toBeCalledWith('get',
                `/orders?starting_after=${otherOrderId}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of orders with limit of 5 and starting after certain order id', async () => {
            const limit = 5;
            const orderDetails2 = {
                id: otherOrderId,
                status: 'cancelled',
                created_on: '2022-05-05T23:23:22.29Z'
            };
            mockMakeApiRequest.mockResolvedValue([orderDetails, orderDetails2]);

            const orders = await sut.getListOfOrders(limit, otherOrderId);

            expect(orders).toEqual([orderDetails, orderDetails2]);
            expect(mockMakeApiRequest).toBeCalledWith('get',
                `/orders?limit=${limit}&starting_after=${otherOrderId}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });
    });

    describe('placeGenericOrder', () => {
        it('place order ', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeGenericOrder(options);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders',
                { 'Content-Type': 'application/json' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order with portfolio id', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15,
                portfolio_id: 'XYZ'
            };

            const order = await sut.placeGenericOrder(options);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders',
                { 'Content-Type': 'application/json' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order with idempotency', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeGenericOrder(options, { idempotencyKey: 'ABCD' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders',
                { 'Content-Type': 'application/json', 'Idempotency-Key': 'ABCD' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place order for subaccount', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: GenericOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                amount_kg: 15
            };

            const order = await sut.placeGenericOrder(options, { subaccountId: 'XYZ' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders',
                { 'Content-Type': 'application/json', 'X-Subaccount-Id': 'XYZ' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    describe('placeRideOrder', () => {
        it('place ride order ', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 12.2
            };

            const order = await sut.placeRideOrder(options);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/ride',
                { 'Content-Type': 'application/json' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place ride order with portfolio id', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 12.2,
                portfolio_id: 'XYZ'
            };

            const order = await sut.placeRideOrder(options);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/ride',
                { 'Content-Type': 'application/json' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place ride order with idempotency', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 15
            };

            const order = await sut.placeRideOrder(options, { idempotencyKey: 'ABCD' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/ride',
                { 'Content-Type': 'application/json', 'Idempotency-Key': 'ABCD' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('place ride order with idempotency and subaccount', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distance_km: 15
            };

            const order = await sut.placeRideOrder(options,
                { idempotencyKey: 'ABCD', subaccountId: 'XYZ' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/ride',
                { 'Content-Type': 'application/json', 'Idempotency-Key': 'ABCD', 'X-Subaccount-Id': 'XYZ' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    describe('getGenericQuote', () => {
        it('get quote', async () => {
            mockMakeApiRequest.mockResolvedValue(quote);

            const params: GenericQuoteParams = {
                amount_kg: 15
            };

            const result = await sut.getGenericQuote(params);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/quotes',
                { 'Content-Type': 'application/json' }, 'json', params);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });

        it('get quote with portfolio id', async () => {
            mockMakeApiRequest.mockResolvedValue(quote);

            const params: GenericQuoteParams = {
                amount_kg: 15,
                portfolio_id: 'XYZ'
            };

            const result = await sut.getGenericQuote(params);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/quotes',
                { 'Content-Type': 'application/json' }, 'json', params);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });
    });

    describe('getRideQuote', () => {
        it('get quote', async () => {
            mockMakeApiRequest.mockResolvedValue(quote);

            const params: RideQuoteParams = {
                distance_km: 10
            };

            const result = await sut.getRideQuote(params);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/quotes/ride',
                { 'Content-Type': 'application/json' }, 'json', params);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });

        it('get quote with portfolio id', async () => {
            mockMakeApiRequest.mockResolvedValue(quote);

            const params: RideQuoteParams = {
                distance_km: 10,
                portfolio_id: 'XYZ'
            };

            const result = await sut.getRideQuote(params);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/quotes/ride',
                { 'Content-Type': 'application/json' }, 'json', params);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(result).toEqual(quote);
        });

    });

    describe('cancelOrder', () => {
        it('cancel order ', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const order = await sut.cancelOrder('123');

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/123/cancel',
                {  }, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('cancel order with idempotency', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const order = await sut.cancelOrder('123', { idempotencyKey: 'ABCD' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/123/cancel',
                { 'Idempotency-Key': 'ABCD' }, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });

        it('cancel order with idempotency and subaccount', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const order = await sut.cancelOrder('123',
                { idempotencyKey: 'ABCD', subaccountId: 'XYZ' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/123/cancel',
                { 'Idempotency-Key': 'ABCD', 'X-Subaccount-Id': 'XYZ' }, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
        });
    });

    describe('getSubaccountDetails', () => {
        it('get subaccount by id', async () => {
            mockMakeApiRequest.mockResolvedValue(subaccountDetails);

            const subaccount = await sut.getSubaccountDetails(subaccountId);

            expect(mockMakeApiRequest).toBeCalledWith('get', `/subaccounts/${subaccount.id}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('getListOfSubaccounts', () => {
        it('get list of subaccounts', async () => {
            mockMakeApiRequest.mockResolvedValue([subaccountDetails]);

            const subaccounts = await sut.getListOfSubaccounts();

            expect(subaccounts).toEqual([subaccountDetails]);
            expect(mockMakeApiRequest).toBeCalledWith('get', '/subaccounts', {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of subaccounts with limit of 5', async () => {
            const subaccountsDetails2: Subaccount = {
                id: otherSubaccountId,
                name: 'Other subaccount'
            };
            const data = [subaccountDetails, subaccountsDetails2];
            mockMakeApiRequest.mockResolvedValue(data);

            const subaccounts = await sut.getListOfSubaccounts(5);

            expect(subaccounts).toEqual([subaccountDetails, subaccountsDetails2]);
            expect(mockMakeApiRequest).toBeCalledWith('get', '/subaccounts?limit=5', {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of subaccounts starting after certain subaccount id', async () => {
            mockMakeApiRequest.mockResolvedValue([subaccountDetails]);

            const subaccounts = await sut.getListOfSubaccounts(undefined, otherSubaccountId);

            expect(subaccounts).toEqual([subaccountDetails]);
            expect(mockMakeApiRequest).toBeCalledWith('get',
                `/subaccounts?starting_after=${otherSubaccountId}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });

        it('get list of subaccounts with limit of 5 and starting after certain subaccount id', async () => {
            const limit = 5;
            const subaccountsDetails2: Subaccount = {
                id: otherSubaccountId,
                name: 'Other subaccount'
            };
            const data = [subaccountDetails, subaccountsDetails2];
            mockMakeApiRequest.mockResolvedValue(data);

            const subaccounts = await sut.getListOfSubaccounts(limit, otherSubaccountId);

            expect(subaccounts).toEqual([subaccountDetails, subaccountsDetails2]);
            expect(mockMakeApiRequest).toBeCalledWith('get',
                `/subaccounts?limit=${limit}&starting_after=${otherSubaccountId}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
        });
    });

    describe('createSubaccount', () => {
        it('create subaccount', async () => {
            mockMakeApiRequest.mockResolvedValue(subaccountDetails);

            const options: SubaccountOptions = {
                name: 'My Company',
                default_portfolio_id: 'XYZ'
            };

            const subaccount = await sut.createSubaccount(options);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/subaccounts',
                { 'Content-Type': 'application/json' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });

        it('create subaccount with idempotency', async () => {
            mockMakeApiRequest.mockResolvedValue(subaccountDetails);

            const options: SubaccountOptions = {
                name: 'My Company',
                default_portfolio_id: 'XYZ'
            };

            const subaccount = await sut.createSubaccount(options, { idempotencyKey: 'ABCD' });

            expect(mockMakeApiRequest).toBeCalledWith('post', '/subaccounts',
                { 'Content-Type': 'application/json', 'Idempotency-Key': 'ABCD' }, 'json', options);
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(subaccount).toEqual(subaccountDetails);
        });
    });

    describe('getImpactData', () => {
        it('get impact data', async () => {
            mockMakeApiRequest.mockResolvedValue(impactData);

            const res = await sut.getImpactData();

            expect(mockMakeApiRequest).toBeCalledWith('get', `/impact/data`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactData);
        });
    });

    describe('getImpactHostedPageConfig', () => {
        it('get impact hosted page config', async () => {
            mockMakeApiRequest.mockResolvedValue(impactHostedPageConfig);

            const res = await sut.getImpactHostedPageConfig();

            expect(mockMakeApiRequest).toBeCalledWith('get', `/impact/hosted-page-config`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(res).toEqual(impactHostedPageConfig);
        });
    });
});
