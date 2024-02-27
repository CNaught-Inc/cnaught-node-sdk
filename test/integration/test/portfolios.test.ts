import { getApiClient } from '../src/client-helper.js';

test('get portfolio by id', async () => {
    const client = getApiClient();

    const portfolio = await client.getPortfolioDetails('oH5hlq'); // well-known Portfolio

    expect(portfolio.name).toBe('Sandbox');
    expect(portfolio.summary).toBe(
        'This portfolio is for sandbox use only and does not represent any real projects'
    );
    expect(portfolio.description).toBe(
        'This portfolio is for sandbox use only and does not represent any real projects'
    );
    expect(portfolio.primary_image_url).toBeNull();
    expect(portfolio.category_allocations).toHaveLength(4);

    portfolio.category_allocations.sort((a, b) =>
        a.category.name.localeCompare(b.category.name)
    );

    expect(portfolio.category_allocations[0].category.name).toBe(
        'Sandbox Project Category A'
    );
    expect(portfolio.category_allocations[0].category.description).toBe(
        'This category is for sandbox use only and does not represent any real data.'
    );
    expect(portfolio.category_allocations[0].category.primary_image_url).toBe(
        'https://assets.cnaught.com/64fd900fcf6f93409fc7ff21/6524ae6d35a66c6068f6bbe1_64cabe99f9ba36af8ecb171c_impact-portfolio.jpeg'
    );
    expect(portfolio.category_allocations[0].category.projects).toHaveLength(1);
    expect(portfolio.category_allocations[0].category.projects[0].name).toBe(
        'Sandbox Project A'
    );
    expect(portfolio.category_allocations[0].category.projects[0].type).toBe(
        'Frontier'
    );
    expect(portfolio.category_allocations[1].category.name).toBe(
        'Sandbox Project Category B'
    );
}, 30000);

test('get portfolios', async () => {
    const client = getApiClient();

    const portfolios = await client.getListOfPortfolios(); // well-known set of portfolios

    expect(portfolios.data).toHaveLength(2);
    expect(portfolios.data[0].id).toBe('oH5hlq');
    expect(portfolios.data[0].name).toBe('Sandbox');
    expect(portfolios.data[0].summary).toBe(
        'This portfolio is for sandbox use only and does not represent any real projects'
    );
    expect(portfolios.data[0].description).toBe(
        'This portfolio is for sandbox use only and does not represent any real projects'
    );
    expect(portfolios.data[0].primary_image_url).toBeNull();
    expect(portfolios.data[1].id).toBe('ixmZSK');
    expect(portfolios.data[1].name).toBe('Alternative Sandbox');
}, 30000);
