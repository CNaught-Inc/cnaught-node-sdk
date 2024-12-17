import { getApiClient } from '../src/client-helper.js';
const client = getApiClient();

beforeAll(async () => {
    const orderList = await client.getListOfOrders();
    if (orderList === undefined || orderList.data.length < 2) {
        await client.placeGenericOrder({ amount_kg: 10.5 });
        await client.placeGenericOrder({ amount_kg: 20 });
    }
}, 60000);

test('Can get list of orders', async () => {
    const orderList = await client.getListOfOrders();
    expect(orderList.data.length).toBeGreaterThanOrEqual(2);
}, 30000);

test('Can get single order', async () => {
    const orderList = await client.getListOfOrders(1);
    expect(orderList.data.length).toEqual(1);
}, 30000);
