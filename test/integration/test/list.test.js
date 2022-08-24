const clientHelper = require('../src/client-helper');
const GenericOrder = require('../../../dist/src/models/GenericOrder')
const client = clientHelper.getApiClient();

beforeAll(async (done) => {
    const orderList = await client.getListOfOrders();
    if (jobList === undefined || jobList.length < 2) {
        await client.placeGenericOrder({ amount_kg: 10.5 });
        await client.placeRideOrder({ distnace_km: 15 });
    }
    done();
}, 60000);

test('Can get list of orders', async () => {
    const orderList = await client.getListOfOrders();
    orderList.forEach((order) => {
        expect(order).toMatchObject(GenericOrder);
    });
}, 30000);

test('Can get single order', async () => {
    const orderList = await client.getListOfOrders(1);
    expect(orderList.length).toEqual(1);
    expect(orderList[0]).toMatchObject(GenericOrder);
}, 30000);
