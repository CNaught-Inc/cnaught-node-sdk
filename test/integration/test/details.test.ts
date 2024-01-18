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
    expect(orderDetails.project_allocations).toHaveLength(4);
    orderDetails.project_allocations.sort((a, b) =>
        a.project.name.localeCompare(b.project.name)
    );

    expect(orderDetails.project_allocations[0].project.name).toBe(
        'Sandbox Project A'
    );
    expect(orderDetails.project_allocations[0].amount_kg).toBe(1050);
    expect(orderDetails.project_allocations[1].project.name).toBe(
        'Sandbox Project B'
    );
    expect(orderDetails.project_allocations[1].amount_kg).toBe(1050);
    expect(orderDetails.project_allocations[2].project.name).toBe(
        'Sandbox Project C'
    );
    expect(orderDetails.project_allocations[2].amount_kg).toBe(600);
    expect(orderDetails.project_allocations[3].project.name).toBe(
        'Sandbox Project D'
    );
    expect(orderDetails.project_allocations[3].amount_kg).toBe(300);
    orderDetails.project_allocations.forEach((pa) => {
        expect(pa.project.name).toMatch(/^Sandbox Project/);
        expect(pa.project.developer).toEqual('Sandbox Project Developer');
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
