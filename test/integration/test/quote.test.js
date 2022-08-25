const fs = require('fs');
const { OrderState } = require('../../../src/models/OrderState');
const clientHelper = require('../src/client-helper');

test('Cannot get generic quote with negative amount', async () => {
    const client = clientHelper.getApiClient();

    try {
        await client.getGenericQuote({ amount_kg: -10 });
    } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.details.title).toBe("Your request parameters didn't validate");
    }
}, 30000);

test('Returns correct amount for generic quote', async () => {
    const client = clientHelper.getApiClient();

    const quote = await client.getGenericQuote( { amount_kg: 10});

    expect(quote.price_usd_cents).toBe(20);
}, 30000);

test('Cannot get ride quote with negative amount', async () => {
    const client = clientHelper.getApiClient();

    try {
        await client.getRideQuote({ distance_km: -10 });
    } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.details.title).toBe("Your request parameters didn't validate");
    }
}, 30000);

test('Returns correct amount for ride quote', async () => {
    const client = clientHelper.getApiClient();

    const quote = await client.getRideQuote( { distance_km: 10});

    expect(quote.price_usd_cents).toBe(20);
}, 30000);