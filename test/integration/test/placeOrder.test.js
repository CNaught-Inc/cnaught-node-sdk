const { randomUUID } = require('crypto');
const { OrderState } = require('../../../src/models/OrderState');
const { OrderType } = require('../../../src/models/OrderType');
const clientHelper = require('../src/client-helper');

test('Cannot place generic order with negative amount', async () => {
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
    const callback = "https://www.example.com/callback";

    const order = await client.placeGenericOrder( {
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    });

    expect(order.state).toBe(OrderState.Placed);
    expect(order.id).not.toBeNull();
    expect(order.created_on).not.toBeNull();
    expect(order.metadata).toBe(metadata);
    expect(order.callback_url).toBe(callback);
    expect(order.amount_kg).toBe(10);
    expect(order.price_usd_cents).toBe(12);
    expect(order.type).toBe(OrderType.Generic);
}, 30000);

test('Placing generic order twice with same idempotency key returns replay', async () => {
    const client = clientHelper.getApiClient();
    const metadata = 'Node sdk submission';
    const callback = "https://www.example.com/callback";

    const orderOpts =  {
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    const order = await client.placeGenericOrder(orderOpts, requestOpts);
    const order2 = await client.placeGenericOrder(orderOpts, requestOpts);

    expect(order.id).not.toBeNull();
    expect(order2.id).toBe(order.id);
}, 30000);

test('Placing generic order twice with same idempotency key but different payload returns error', async () => {
    const client = clientHelper.getApiClient();
    const metadata = 'Node sdk submission';
    const callback = "https://www.example.com/callback";

    const orderOpts =  {
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    const order = await client.placeGenericOrder(orderOpts, requestOpts);
    orderOpts.metadata = orderOpts.metadata + ' changed';

    try {
        await client.placeGenericOrder(orderOpts, requestOpts);
    } catch (error) {
        expect(error.statusCode).toEqual(422);
        expect(error.details.title).toBe("Previous request submitted with same idempotency key had different payload");
    }
}, 30000);


test('Cannot place ride order with negative distance', async () => {
    const client = clientHelper.getApiClient();

    try {
        await client.placeRideOrder({ distnace_km: -10 });
    } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.details.title).toBe("Your request parameters didn't validate");
    }
}, 30000);

test('Can submit ride order', async () => {
    const client = clientHelper.getApiClient();
    const metadata = 'Node sdk submission';
    const callback = "https://www.example.com/callback";

    const order = await client.placeRideOrder( {
        distance_km: 30,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    });

    expect(order.state).toBe(OrderState.Placed);
    expect(order.id).not.toBeNull();
    expect(order.created_on).not.toBeNull();
    expect(order.metadata).toBe(metadata);
    expect(order.callback_url).toBe(callback);
    expect(order.amount_kg).toBe(7.674);
    expect(order.price_usd_cents).toBe(10);
    expect(order.type).toBe(OrderType.Ride);
}, 30000);

test('Submitting ride order twice with same idempotency key returns replay', async () => {
    const client = clientHelper.getApiClient();
    const metadata = 'Node sdk submission';
    const callback = "https://www.example.com/callback";

    const orderOpts =  {
        distance_km: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    const order = await client.placeRideOrder(orderOpts, requestOpts);
    const order2 = await client.placeRideOrder(orderOpts, requestOpts);

    expect(order.id).not.toBeNull();
    expect(order2.id).toBe(order.id);
}, 30000);

test('Placing ride order twice with same idempotency key but different payload returns error', async () => {
    const client = clientHelper.getApiClient();
    const metadata = 'Node sdk submission';
    const callback = "https://www.example.com/callback";

    const orderOpts =  {
        distance_km: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    const order = await client.placeRideOrder(orderOpts, requestOpts);
    orderOpts.metadata = orderOpts.metadata + ' changed';

    try {
        await client.placeRideOrder(orderOpts, requestOpts);
    } catch (error) {
        expect(error.statusCode).toEqual(422);
        expect(error.details.title).toBe("Previous request submitted with same idempotency key had different payload");
    }
}, 30000);
