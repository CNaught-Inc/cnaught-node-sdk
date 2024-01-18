import { getApiClient } from '../src/client-helper.js';

test('get project by id', async () => {
    const client = getApiClient();

    const project = await client.getProjectDetails('I0UbDH'); // well-known project

    expect(project.name).toBe('Sandbox Project A');
    expect(project.type).toBe('Frontier');
    expect(project.developer).toBe('Sandbox Project Developer');
    expect(project.summary).toBeNull();
    expect(project.description).toBe(
        'This is a sandbox project, not a real project.'
    );
    expect(project.location_name).toBe('Net Zero, Future');
    expect(project.location_latitude).toBe(37.77619);
    expect(project.location_longitude).toBe(-122.43465);
    expect(project.registry_name).toBe('None');
    expect(project.registry_id).toBeNull();
    expect(project.registry_url).toBeNull();
    expect(project.primary_image_url).toBe(
        'https://assets-stage.cnaught.com/64fd900fcf6f93409fc7ff21/6525d21f1a6953d320ea7901_64cabf485b8978f04658185f_pexels-symeon-ekizoglou-2880801.jpg'
    );
    expect(project.un_sdg_goals).toBe([1, 4, 6]);
}, 30000);
