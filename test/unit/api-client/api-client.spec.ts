import { CNaughtApiClient } from '../../../src/api-client';
import { ApiRequestHandler } from '../../../src/api-request-handler';
import { GenericOrderOptions } from '../../../src/models/GenericOrderOptions';
import { RideOrderOptions } from '../../../src/models/RideOrderOptions';
import { GenericQuoteParams } from '../../../src/models/GenericQuoteParams';
import { RideQuoteParams } from '../../../src/models/RideQuoteParams';

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

    const quote = {
        amount_kg: 20.5,
        price_usd_cents: 10
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
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const order = await sut.getOrderDetails(orderId);

            expect(mockMakeApiRequest).toBeCalledWith('get', `/orders/${orderDetails.id}`, {}, 'json');
            expect(mockMakeApiRequest).toBeCalledTimes(1);
            expect(order).toEqual(orderDetails);
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
    });

    describe('placeRideOrder', () => {
        it('place ride order ', async () => {
            mockMakeApiRequest.mockResolvedValue(orderDetails);

            const options: RideOrderOptions = {
                metadata: 'clientid:124',
                notification_config: {
                    url: 'https://www.example.com/callback'
                },
                distnace_km: 12.2
            };

            const order = await sut.placeRideOrder(options);

            expect(mockMakeApiRequest).toBeCalledWith('post', '/orders/ride',
                { 'Content-Type': 'application/json' }, 'json', options);
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
    });

    describe('getRideQuote', () => {
        it('get quote', async () => {
            mockMakeApiRequest.mockResolvedValue(quote);

            const params: RideQuoteParams = {
                distnace_km: 10
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
    });
});
