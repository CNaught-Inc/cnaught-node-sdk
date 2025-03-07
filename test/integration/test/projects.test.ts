import { getApiClient } from '../src/client-helper.js';

test('get project by id', async () => {
    const client = getApiClient();

    const project = await client.getProjectDetails('I0UbDH'); // well-known project

    expect(project.name).toBe('Sandbox Project A');
    expect(project.type).toBe('Reforestation');
    expect(project.developer).toBe('Sandbox Project Developer');
    expect(project.summary).toBe('Sandbox Project A is a reforestation initiative in the Pacific Northwest.');
    expect(project.description).toBe(
        'This project focuses on restoring native forest ecosystems through sustainable planting practices and community engagement.'
    );
    expect(project.location_name).toBe('Pacific Northwest, USA');
    expect(project.location_latitude).toBe(47.6062);
    expect(project.location_longitude).toBe(-122.3321);
    expect(project.registry_name).toBe('None');
    expect(project.registry_id).toBeNull();
    expect(project.registry_url).toBeNull();
    expect(project.primary_image_url).toBe(
        'https://assets.cnaught.com/64fd900fcf6f93409fc7ff21/67466d4c5dac34242677eb4b_64cabf485b8978f04658185f_pexels-symeon-ekizoglou-2880801.webp'
    );
    expect(project.un_sdg_goals).toStrictEqual([1, 4, 6]);
}, 30000);
