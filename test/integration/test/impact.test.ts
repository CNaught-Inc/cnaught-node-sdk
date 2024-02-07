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
    expect(impactData.since_date).toBe('2023-09-26T00:18:51.764508Z');
    expect(impactData.to_date).toBeFalsy();
}, 30000);

test('Can retrieve impact data with date range', async () => {
    const client = getApiClient();
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 1, 1);
    const impactData = await client.getImpactData({
        from,
        to
    });
    expect(impactData.name).toBe('CNaught');
    expect(new Date(impactData.since_date)).toStrictEqual(from);
    expect(new Date(impactData.to_date!)).toStrictEqual(to);
    expect(impactData.total_offset_kgs).toBe(1571); // for fixed time range in the past and user this is known
}, 30000);
