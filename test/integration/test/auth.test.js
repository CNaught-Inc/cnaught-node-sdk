const clientHelper = require('../src/client-helper');

test('Cannot authenticate with invalid api key', async () => {
    const randomString = Math.random().toString(36).replace('0.', '');
    const client = clientHelper.getApiClient(randomString);
    try {
        await client.getListOfOrders();
    } catch (error) {
        console.log(error)
        expect(error.statusCode).toEqual(401);
        expect(error.details.title).toBe('Unauthorized');
    }
}, 15000);
