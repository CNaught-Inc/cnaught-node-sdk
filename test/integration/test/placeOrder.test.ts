import { getApiClient } from '../src/client-helper.js';
import {
    CNaughtError,
    OrderState,
    OrderType
} from '../../../src/models/index.js';
import { randomUUID } from 'crypto';

test('Cannot place generic order with negative amount', async () => {
    const client = getApiClient();

    try {
        await client.placeGenericOrder({ amount_kg: -10 });
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

test('Can submit generic order', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeGenericOrder({
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
    expect(order.type).toBe(OrderType.Generic);
}, 30000);

test('Can submit generic order with portfolio ID', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeGenericOrder({
        amount_kg: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        },
        portfolio_id: 'XYZ' // on sandbox, portfolio ids are accepted but ignored
    });

    expect(order.state).toBe(OrderState.Placed);
    expect(order.id).not.toBeNull();
}, 30000);

test('Placing generic order twice with same idempotency key returns replay', async () => {
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
    const order = await client.placeGenericOrder(orderOpts, requestOpts);
    const order2 = await client.placeGenericOrder(orderOpts, requestOpts);

    expect(order.id).not.toBeNull();
    expect(order2.id).toBe(order.id);
}, 30000);

test('Placing generic order twice with same idempotency key but different payload returns error', async () => {
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
    await client.placeGenericOrder(orderOpts, requestOpts);
    orderOpts.metadata = orderOpts.metadata + ' changed';

    try {
        await client.placeGenericOrder(orderOpts, requestOpts);
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(422);
        expect(cnaughtErr.problemDetails.title).toEqual(
            'Previous request submitted with same idempotency key had different payload'
        );
    }
}, 30000);

test('Cannot place ride order with negative distance', async () => {
    const client = getApiClient();

    try {
        await client.placeRideOrder({ distance_km: -10 });
        throw new Error('Should have thrown validation error');
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(400);
        expect(cnaughtErr.problemDetails.title).toEqual(
            "Your request parameters didn't validate"
        );
    }
}, 30000);

test('Can submit ride order', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeRideOrder({
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
    expect(order.amount_kg).toBe(7.235);
    expect(order.price_usd_cents).toBe(14);
    expect(order.type).toBe(OrderType.Ride);
}, 30000);

test('Can submit ride order with portfolio id', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const order = await client.placeRideOrder({
        distance_km: 30,
        metadata: metadata,
        notification_config: {
            url: callback
        },
        portfolio_id: 'XYZ' // on sandbox, portfolio ids are accepted but ignored
    });

    expect(order.state).toBe(OrderState.Placed);
    expect(order.id).not.toBeNull();
}, 30000);

test('Submitting ride order twice with same idempotency key returns replay', async () => {
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const orderOpts = {
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
    const client = getApiClient();
    const metadata = 'Node sdk submission';
    const callback = 'https://www.example.com/callback';

    const orderOpts = {
        distance_km: 10,
        metadata: metadata,
        notification_config: {
            url: callback
        }
    };
    const requestOpts = { idempotencyKey: randomUUID() };
    await client.placeRideOrder(orderOpts, requestOpts);
    orderOpts.metadata = orderOpts.metadata + ' changed';

    try {
        await client.placeRideOrder(orderOpts, requestOpts);
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(422);
        expect(cnaughtErr.problemDetails.title).toEqual(
            'Previous request submitted with same idempotency key had different payload'
        );
    }
}, 30000);
