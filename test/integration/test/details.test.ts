import { getApiClient } from '../src/client-helper.js';
import { CNaughtError } from '../../../src/models/index.js';

test('Order not found', async () => {
    const client = getApiClient();
    const randomString = Math.random().toString(36).replace('0.', '');
    try {
        await client.getOrderDetails(randomString);
        throw new Error('should have thrown not found');
    } catch (error) {
        expect(error).toBeInstanceOf(CNaughtError);
        const cnaughtErr = error as CNaughtError;
        expect(cnaughtErr.status).toEqual(404);
        expect(cnaughtErr.problemDetails.title).toEqual('Could not find order');
    }
}, 30000);

test('Fulfilled order', async () => {
    const client = getApiClient();
    const orderDetails = await client.getOrderDetails('2FhU3B0F36_sandbox'); // well known order
    expect(orderDetails.amount_kg).toEqual(3000);
    expect(orderDetails.project_allocations).toHaveLength(3);
    orderDetails.project_allocations.forEach((pa) => {
        expect(pa.amount_kg).toEqual(1000);
        expect(pa.project.name).toMatch(/^CNaught Sandbox Project/);
        expect(pa.project.developer).toEqual('CNaught Sandbox Developer');
        expect(pa.project.location_name).toEqual('Net Zero, Future');
        expect(pa.project.summary).toEqual('Not a real project');
        expect(pa.project.description).toEqual(
            'This is a sandbox project, not a real project.'
        );
        expect(pa.project.primary_image_url).toMatch(
            /^https:\/\/assets\.cnaught\.com\//
        );
    });
}, 30000);
