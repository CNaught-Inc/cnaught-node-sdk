import { CNaughtError, OffsetsQuote } from '../../../src/models/index.js';

import { getApiClient } from '../src/client-helper.js';

type TestCaseParams = [
    string,
    object,
    { params: object; expectedQuote: object }
];

describe.each([
    [
        'getGenericQuote',
        { amount_kg: -10 },
        {
            params: { amount_kg: 10 },
            expectedQuote: { amount_kg: 10, price_usd_cents: 20 }
        }
    ],
    [
        'getAirFreightQuote',
        { freight_mass_kg: -10, distance_km: 10 },
        {
            params: { freight_mass_kg: 10, distance_km: 100 },
            expectedQuote: { amount_kg: 2, price_usd_cents: 4 }
        }
    ],
    [
        'getFlightQuote',
        { distance_km: -10 },
        {
            params: { distance_km: 100 },
            expectedQuote: { amount_kg: 10, price_usd_cents: 20 }
        }
    ],
    [
        'getGroundFreightQuote',
        { freight_mass_kg: -10, distance_km: 10 },
        {
            params: { freight_mass_kg: 100, distance_km: 1000 },
            expectedQuote: { amount_kg: 14, price_usd_cents: 28 }
        }
    ],
    [
        'getGroundTransportQuote',
        { distance_km: -10, vehicle_type: 'school_bus' },
        {
            params: { distance_km: 1000, vehicle_type: 'school_bus' },
            expectedQuote: { amount_kg: 745, price_usd_cents: 1490 }
        }
    ],
    [
        'getOfficeSpaceQuote',
        { square_footage: -10 },
        {
            params: { square_footage: 1000 },
            expectedQuote: { amount_kg: 8600, price_usd_cents: 17200 }
        }
    ],
    [
        'getTrainQuote',
        { distance_km: -10 },
        {
            params: { distance_km: 1000 },
            expectedQuote: { amount_kg: 38, price_usd_cents: 76 }
        }
    ],
    [
        'getRideQuote',
        { distance_km: -10 },
        {
            params: { distance_km: 30 },
            expectedQuote: { amount_kg: 8, price_usd_cents: 16 }
        }
    ]
] as TestCaseParams[])(
    '%s',
    (
        quoteFnName: string,
        invalidParams: any,
        { params, expectedQuote }: { params: any; expectedQuote: OffsetsQuote }
    ) => {
        test('Cannot get quote with invalid params', async () => {
            const client = getApiClient();

            try {
                await client[quoteFnName](invalidParams);
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

        test('Returns correct amount for quote', async () => {
            const client = getApiClient();

            const quote = await client[quoteFnName](params);

            expect(quote).toEqual(expectedQuote);
        }, 30000);
    }
);
