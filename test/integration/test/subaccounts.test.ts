import { getApiClient } from '../src/client-helper.js';
import { randomUUID } from 'crypto';
import * as fs from 'node:fs';

test('Can create, update and retrieve subaccount', async () => {
    const client = getApiClient();

    const subaccountName = randomUUID();
    const portfolioId = 'oH5hlq';
    const sub = await client.createSubaccount({
        name: subaccountName,
        default_portfolio_id: portfolioId, // well known portfolio id
        logo_url: 'http://example.com/image.png'
    });
    const updatedSubaccountName = randomUUID();
    const retrievedSub = await client.getSubaccountDetails(sub.id);
    const updatedSub = await client.updateSubaccount(sub.id, {
        name: updatedSubaccountName
    });
    const retrievedUpdatedSub = await client.getSubaccountDetails(sub.id);

    expect(sub.name).toBe(subaccountName);
    expect(sub.default_portfolio_id).toBe(portfolioId);
    expect(sub.logo_url).not.toEqual(null);
    expect(sub.created_on).not.toEqual(null);
    expect(retrievedSub.name).toBe(sub.name);
    expect(retrievedSub.default_portfolio_id).toBe(sub.default_portfolio_id);
    expect(retrievedSub.logo_url).not.toEqual(null);

    expect(updatedSub.name).toBe(updatedSubaccountName);
    expect(updatedSub.default_portfolio_id).toBe(null);
    expect(updatedSub.logo_url).not.toEqual(null);
    expect(retrievedUpdatedSub.name).toBe(updatedSub.name);
    expect(retrievedUpdatedSub.default_portfolio_id).toBe(
        updatedSub.default_portfolio_id
    );
    expect(retrievedUpdatedSub.logo_url).not.toEqual(null);
}, 30000);

test('Can update subaccount logo from url', async () => {
    const client = getApiClient();

    const sub = await client.createSubaccount({
        name: randomUUID(),
        default_portfolio_id: 'oH5hlq'
    });
    const updatedSub = await client.updateSubaccountLogoFromUrl(sub.id, {
        logo_url: 'http://example.com/image.png'
    });
    const retrievedUpdatedSub = await client.getSubaccountDetails(sub.id);

    expect(sub.logo_url).toEqual(null);
    expect(updatedSub.name).toBe(sub.name);
    expect(updatedSub.default_portfolio_id).toBe(sub.default_portfolio_id);
    expect(updatedSub.logo_url).not.toEqual(null);
    expect(retrievedUpdatedSub.logo_url).toBe(updatedSub.logo_url);
}, 30000);

test('Can update subaccount logo from file', async () => {
    const client = getApiClient();

    const sub = await client.createSubaccount({
        name: randomUUID(),
        default_portfolio_id: 'oH5hlq'
    });
    fs.readFile(
        './test/integration/resources/cnaught-logo.png',
        async (err, data) => {
            const updatedSub = await client.updateSubaccountLogoFromImageData(
                sub.id,
                {
                    logo_file_content: data,
                    content_type: 'image/png'
                }
            );
            const retrievedUpdatedSub = await client.getSubaccountDetails(
                sub.id
            );

            expect(sub.logo_url).toEqual(null);
            expect(updatedSub.name).toBe(sub.name);
            expect(updatedSub.default_portfolio_id).toBe(
                sub.default_portfolio_id
            );
            expect(updatedSub.logo_url).not.toEqual(null);
            expect(retrievedUpdatedSub.logo_url).toBe(updatedSub.logo_url);
        }
    );
}, 30000);

test('Can clear subaccount logo', async () => {
    const client = getApiClient();

    const sub = await client.createSubaccount({
        name: randomUUID(),
        default_portfolio_id: 'oH5hlq',
        logo_url: 'http://example.com/image.png'
    });
    const updatedSub = await client.removeSubaccountLogo(sub.id);
    const retrievedUpdatedSub = await client.getSubaccountDetails(sub.id);

    expect(sub.logo_url).not.toEqual(null);
    expect(updatedSub.name).toBe(sub.name);
    expect(updatedSub.default_portfolio_id).toBe(sub.default_portfolio_id);
    expect(updatedSub.logo_url).toEqual(null);
    expect(retrievedUpdatedSub.logo_url).toEqual(null);
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
