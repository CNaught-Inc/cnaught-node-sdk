import { Readable } from 'stream';

import { CNaughtApiClient } from '../../../src/api-client';
import { ApiRequestHandler } from '../../../src/api-request-handler';
import { GenericOrderOptions } from '../../../src/models/GenericOrderOptions';
import { RideOrderOptions } from '../../../src/models/RideOrderOptions';
import { NotificationConfig } from '../../../src/models/NotificationConfig';

jest.mock('../../../src/api-request-handler');

describe('api-client order creation', () => {
    let sut: CNaughtApiClient;
    let mockMakeApiRequest: jest.Mock;

    const orderId = 'ABCXYZ';
    const callbackUrl = 'https://www.example.com/callback';
    const notificationConfig: NotificationConfig = {
        url: callbackUrl,
    };
    const genericOrderDetails = {
        id: orderId,
        state: 'placed',
        created_on: '2022-05-01T00:00:00.29Z',
        metadata: 'User Metadata',
        price_usd_cents: 10,
        amount_kg: 20.5,
        type: 'generic',
        callback_url: 'http://www.example.com/callback'    
    };

    beforeEach(() => {
        mockMakeApiRequest = jest.fn().mockResolvedValue(genericOrderDetails);
        (ApiRequestHandler as jest.Mock<ApiRequestHandler>).mockImplementationOnce(() => ({
            makeApiRequest: mockMakeApiRequest
        }));
        sut = new CNaughtApiClient('apikey');
    });

    describe('placeGenericOrder', () => {
        it('place order ', async () => {
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
            expect(order).toEqual(genericOrderDetails);
        });
    });

    describe('placeRideOrder', () => {
        it('place ride order ', async () => {
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
            expect(order).toEqual(genericOrderDetails);
        });
    });
});
