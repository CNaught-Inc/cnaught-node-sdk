import { getApiClient } from '../src/client-helper.js';

test('get project category by id', async () => {
    const client = getApiClient();

    const projectCategory = await client.getProjectCategoryDetails('hkgyn3'); // well-known project category

    expect(projectCategory.name).toBe('Sandbox Project Category A');
    expect(projectCategory.description).toBe(
        'This category is for sandbox use only and does not represent any real data.'
    );
    expect(projectCategory.primary_image_url).toBe(
        'https://assets.cnaught.com/64fd900fcf6f93409fc7ff21/67466d461956d2f8b3ccb4bb_64cabe99f9ba36af8ecb171c_impact-portfolio.webp'
    );
    expect(projectCategory.projects).toHaveLength(1);
    expect(projectCategory.projects[0].name).toBe('Sandbox Project A');
    expect(projectCategory.projects[0].type).toBe('Reforestation');
}, 30000);
