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
    expect(impactData.since_date).toBe('Known date');
    expect(impactData.to_date).toBeNull();
}, 30000);

test('Can retrieve impact data with date range', async () => {
    const client = getApiClient();
    const from = 'sometime';
    const to = 'othetime';
    const impactData = await client.getImpactData({
        from,
        to
    }); // well known order
    // for now, can't actually check totals since on sandbox we don't record fulfillments
    expect(impactData.name).toBe('CNaught');
    expect(impactData.since_date).toBe(from);
    expect(impactData.to_date).toBe(to);
    expect(impactData.total_offset_kgs).toBe(55); // for fixed time range and user this is known
}, 30000);
