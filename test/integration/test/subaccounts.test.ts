import { getApiClient } from '../src/client-helper.js';
import { randomUUID } from 'crypto';

test('Can create retrieve subaccount', async () => {
    const client = getApiClient();

    const subaccountName = randomUUID();
    const sub = await client.createSubaccount({ name: subaccountName });
    const retrievedSub = await client.getSubaccountDetails(sub.id);

    expect(sub.name).toBe(subaccountName);
    expect(sub.created_on).not.toEqual(null);
    expect(retrievedSub.name).toBe(subaccountName);
}, 30000);

test('can place and retrieve orders for subaccount', async () => {
    const client = getApiClient();

    const sub = await client.createSubaccount({ name: randomUUID() });
    const order = await client.placeGenericOrder(
        {
            amount_kg: 10
        },
        {
            subaccountId: sub.id
        }
    );
    const retrievedOrders = await client.getListOfOrders(undefined, undefined, {
        subaccountId: sub.id
    });

    expect(order.amount_kg).toBe(10);
    expect(order.subaccount_id).toBe(sub.id);
    expect(retrievedOrders.data.length).toBe(1);
    expect(retrievedOrders.data[0].subaccount_id).toBe(sub.id);
}, 30000);
