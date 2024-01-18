import { getApiClient } from '../src/client-helper.js';

test('get portfolio by id', async () => {
    const client = getApiClient();

    const portfolio = await client.getPortfolioDetails('oH5hlq'); // well-known Portfolio

    expect(portfolio.name).toBe('Sandbox');
}, 30000);
