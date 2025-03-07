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
    expect(orderDetails.project_allocations[0].project.name).toBe(
        'Sandbox Project A'
    );
    expect(orderDetails.project_allocations[0].project.developer).toEqual('Sandbox Project Developer');
    expect(orderDetails.project_allocations[0].project.location_name).toEqual('Pacific Northwest, USA');
    expect(orderDetails.project_allocations[0].project.summary).toEqual('Sandbox Project A is a reforestation initiative in the Pacific Northwest.');
    expect(orderDetails.project_allocations[0].project.description).toEqual(
        'This project focuses on restoring native forest ecosystems through sustainable planting practices and community engagement.'
    );
    expect(orderDetails.project_allocations[0].project.primary_image_url).toMatch(
        /^https:\/\/assets\.cnaught\.com\//
    );
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
}, 30000);
