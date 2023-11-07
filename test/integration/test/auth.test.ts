import { getApiClient } from '../src/client-helper.js';
import { CNaughtError } from '../../../src/models/index.js';

test('Cannot authenticate with invalid api key', async () => {
    const randomString = Math.random().toString(36).replace('0.', '');
    const client = getApiClient(randomString);
    try {
        await client.getListOfOrders();
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(401);
        expect(cnaughtErr.problemDetails.title).toEqual('Unauthorized');
    }
}, 15000);
