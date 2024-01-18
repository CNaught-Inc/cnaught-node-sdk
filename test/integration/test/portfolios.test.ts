import { getApiClient } from '../src/client-helper.js';

test('get portfolio by id', async () => {
    const client = getApiClient();

    const portfolio = await client.getPortfolioDetails('oH5hlq'); // well-known Portfolio

    expect(portfolio.name).toBe('Sandbox');
}, 30000);

test('get portfolios', async () => {
    const client = getApiClient();

    const portfolios = await client.getListOfPortfolios(); // well-known Portfolio

    expect(portfolios.data).toHaveLength(2);
    expect(portfolios.data[0].name).toBe('Sandbox');
    expect(portfolios.data[1].name).toBe('Alternative Sandbox');
}, 30000);
