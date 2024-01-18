import { getApiClient } from '../src/client-helper.js';

test('get project category by id', async () => {
    const client = getApiClient();

    const projectCategory = await client.getProjectCategoryDetails('hkgyn3'); // well-known project category

    expect(projectCategory.name).toBe('Sandbox Category A');
}, 30000);
