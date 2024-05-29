import { randomUUID } from 'crypto';
import { CNaughtError } from '../../../src/models/CNaughtError.js';
import { CheckoutSession } from '../../../src/models/CheckoutSession.js';
import { Subaccount } from '../../../src/models/Subaccount.js';
import { getApiClient } from '../src/client-helper.js';
import { CNaughtApiClient } from '../../../src/api-client.js';

describe('createCheckoutSession', () => {
    let client: CNaughtApiClient;
    let sub: Subaccount;

    beforeAll(async () => {
        client = getApiClient();

        sub = await client.createSubaccount({
            name: randomUUID(),
            default_portfolio_id: 'oH5hlq'
        });
    });

    test.each([0, -100])(
        'Cannot create checkout session with invalid amount %d',
        async (invalidAmountKg: number) => {
            try {
                await client.createCheckoutSession(
                    {
                        amount_kg: invalidAmountKg,
                        success_url: 'https://www.example.com',
                        cancel_url: 'https://www.example.com'
                    },
                    { subaccountId: sub.id }
                );
            } catch (error) {
                expect(error).toBeInstanceOf(CNaughtError);
                const cnaughtErr = error as CNaughtError;
                expect(cnaughtErr.status).toBe(400);
            }
        }
    );

    test.each([
        'http://www.example.com',
        '/success',
        'www.example.com/success'
    ])(
        'Cannot create checkout session with invalid success url: %s',
        async (invalidSuccessUrl: string) => {
            try {
                await client.createCheckoutSession(
                    {
                        amount_kg: 100,
                        success_url: invalidSuccessUrl,
                        cancel_url: 'https://www.example.com'
                    },
                    { subaccountId: sub.id }
                );
            } catch (error) {
                expect(error).toBeInstanceOf(CNaughtError);
                const cnaughtErr = error as CNaughtError;
                expect(cnaughtErr.status).toBe(400);
            }
        }
    );

    test.each(['http://www.example.com', '/cancel', 'www.example.com/cancel'])(
        'Cannot create checkout session with invalid cancel url: %s',
        async (invalidCancelUrl: string) => {
            try {
                await client.createCheckoutSession(
                    {
                        amount_kg: 100,
                        success_url: 'https://www.example.com',
                        cancel_url: invalidCancelUrl
                    },
                    { subaccountId: sub.id }
                );
            } catch (error) {
                expect(error).toBeInstanceOf(CNaughtError);
                const cnaughtErr = error as CNaughtError;
                expect(cnaughtErr.status).toBe(400);
            }
        }
    );

    test('Can create checkout session', async () => {
        const client = getApiClient();
        const checkoutSession = await client.createCheckoutSession(
            {
                amount_kg: 100,
                success_url: 'https://www.example.com',
                cancel_url: 'https://www.example.com'
            },
            { subaccountId: sub.id }
        );
        expect(checkoutSession).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                checkout_url: expect.any(String),
                state: 'open',
                amount_kg: 100,
                price_usd_cents: expect.any(Number)
            } satisfies CheckoutSession)
        );
    });
});
