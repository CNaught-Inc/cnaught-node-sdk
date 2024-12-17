import { getApiClient } from '../src/client-helper.js';
import {
    CNaughtError,
    OrderState
} from '../../../src/models/index.js';
import { randomUUID } from 'crypto';

test('Cannot place order with negative amount', async () => {
    const client = getApiClient();

    try {
        await client.placeOrder({ amount_kg: -10 });
        throw new Error('should have thrown validation error');
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(400);
        expect(cnaughtErr.problemDetails.title).toEqual(
            "Your request parameters didn't validate"
        );
    }
}, 30000);

test('Can submit order', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeOrder({
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
    expect(order.price_usd_cents).toBe(20);
}, 30000);

test('Can submit order by total price', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeOrder({
        total_price_usd_cents: 3190,
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
    expect(order.amount_kg).toBe(1595);
    expect(order.price_usd_cents).toBe(3190);
}, 30000);

test('Can submit order with portfolio ID', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeOrder({
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        },
        portfolio_id: 'ixmZSK' // well-known portfolio id
    });

    expect(order.state).toBe(OrderState.Placed);
    expect(order.id).not.toBeNull();
}, 30000);

test('Placing order twice with same idempotency key returns replay', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const orderOpts = {
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    const order = await client.placeOrder(orderOpts, requestOpts);
    const order2 = await client.placeOrder(orderOpts, requestOpts);

    expect(order.id).not.toBeNull();
    expect(order2.id).toBe(order.id);
}, 30000);

test('Placing order twice with same idempotency key but different payload returns error', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const orderOpts = {
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    await client.placeOrder(orderOpts, requestOpts);
    orderOpts.metadata = orderOpts.metadata + ' changed';

    try {
        await client.placeOrder(orderOpts, requestOpts);
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(422);
        expect(cnaughtErr.problemDetails.title).toEqual(
            'Previous request submitted with same idempotency key had different payload'
        );
    }
}, 30000);