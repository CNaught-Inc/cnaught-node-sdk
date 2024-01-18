import { getApiClient } from '../src/client-helper.js';

test('get project by id', async () => {
    const client = getApiClient();

    const project = await client.getProjectDetails('I0UbDH'); // well-known project

    expect(project.name).toBe('Sandbox Project A');
    expect(project.developer).toBe('Sandbox Project Developer');
}, 30000);
