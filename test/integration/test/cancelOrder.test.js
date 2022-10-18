const fs = require('fs');
const { OrderState } = require('../../../src/models/OrderState');
const { OrderType } = require('../../../src/models/OrderType');
const clientHelper = require('../src/client-helper');

test('Cannot cancel order with invalid order id', async () => {
    const client = clientHelper.getApiClient();

    try {
        await client.cancelOrder('123');
    } catch (error) {
        expect(error.statusCode).toEqual(404);
        expect(error.details.title).toBe("Could not find order");
    }
}, 30000);