import { getApiClient } from '../src/client-helper.js';
import { CNaughtError } from '../../../src/models/index.js';

test('Cannot cancel order with invalid order id', async () => {
    const client = getApiClient();

    try {
        await client.cancelOrder('123');
        throw new Error('Should have thrown validation error');
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(404);
        expect(cnaughtErr.problemDetails.title).toEqual('Could not find order');
    }
}, 30000);
