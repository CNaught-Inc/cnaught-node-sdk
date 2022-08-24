const fs = require('fs');
const { OrderState } = require('../../../src/models/OrderState');
const clientHelper = require('../src/client-helper');

test('Cannot place order with negative amount', async () => {
    const client = clientHelper.getApiClient();

    try {
        await client.placeGenericOrder({ amount_kg: -10 });
    } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.details.title).toBe("Your request parameters didn't validate");
    }
}, 30000);

test('Can submit generic order', async () => {
    const client = clientHelper.getApiClient();
    const metadata = 'Node sdk submission';

    const order = await client.placeGenericOrder( { amount_kg: 5, metadata: metadata});

    expect(order.state).toBe(OrderState.Placed);
    expect(order.id).not.toBeNull();
    expect(order.metadata).toBe(metadata);
}, 30000);