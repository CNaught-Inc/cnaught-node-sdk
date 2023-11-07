import { CNaughtError } from '../../../src/models/index.js';

import { getApiClient } from '../src/client-helper.js';

test('Cannot get generic quote with negative amount', async () => {
    const client = getApiClient();

    try {
        await client.getGenericQuote({ amount_kg: -10 });
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

test('Returns correct amount for generic quote', async () => {
    const client = getApiClient();

    const quote = await client.getGenericQuote({ amount_kg: 10 });

    expect(quote.amount_kg).toBe(10);
    expect(quote.price_usd_cents).toBe(20);
}, 30000);

test('Cannot get ride quote with negative amount', async () => {
    const client = getApiClient();

    try {
        await client.getRideQuote({ distance_km: -10 });
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

test('Returns correct amount for ride quote', async () => {
    const client = getApiClient();

    const quote = await client.getRideQuote({ distance_km: 30 });

    expect(quote.amount_kg).toBe(7.2342);
    expect(quote.price_usd_cents).toBe(14);
}, 30000);
