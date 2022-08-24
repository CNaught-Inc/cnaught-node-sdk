const clientHelper = require('../src/client-helper');

test('Order not found', async() => {
    const client = clientHelper.getApiClient();
    const randomString = Math.random().toString(36).replace('0.', '');
    try {
        await client.getOrderDetails(randomString);
    } catch (error) {
        expect(error.statusCode).toEqual(404);
        expect(error.details.title).toBe('could not find order');
    }
}, 30000);
