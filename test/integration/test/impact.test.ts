import { getApiClient } from '../src/client-helper.js';

test('Can retrieve impact config', async () => {
    const client = getApiClient();
    const impactConfig = await client.getImpactHostedPageConfig(); // well known order
    expect(impactConfig.enabled).toBe(true);
    expect(impactConfig.url).toMatch(/^https:\/\/impact.cnaught.com\/.*/);
    expect(impactConfig.enabled_equivalents).toEqual([
        'cars',
        'homes',
        'flights',
        'trees'
    ]);
}, 30000);

test('Can retrieve impact data', async () => {
    const client = getApiClient();
    const impactData = await client.getImpactData(); // well known order
    // for now, can't actually check totals since on sandbox we don't record fulfillments
    expect(impactData.name).toBe('CNaught');
}, 30000);
