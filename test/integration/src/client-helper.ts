import { CNaughtApiClient } from '../../../src/api-client.js';
import { getApiKey, getApiHostname } from './config-helper.js';

export const getApiClient = (apiKey = getApiKey()) =>
    new CNaughtApiClient(apiKey, {
        hostname: getApiHostname()
    });
