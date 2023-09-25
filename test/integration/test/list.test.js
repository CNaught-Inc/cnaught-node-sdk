const clientHelper = require('../src/client-helper');
const GenericOrder = require('../../../dist/src/models/GenericOrder');
const client = clientHelper.getApiClient();

beforeAll(async () => {
    const orderList = await client.getListOfOrders();
    if (orderList === undefined || orderList.length < 2) {
        await client.placeGenericOrder({ amount_kg: 10.5 });
        await client.placeRideOrder({ distnace_km: 15 });
    }
}, 60000);

test('Can get list of orders', async () => {
    const orderList = await client.getListOfOrders();
    orderList.data.forEach((order) => {
        expect(order).toMatchObject(GenericOrder);
    });
}, 30000);

test('Can get single order', async () => {
    const orderList = await client.getListOfOrders(1);
    expect(orderList.data.length).toEqual(1);
    expect(orderList.data[0]).toMatchObject(GenericOrder);
}, 30000);
