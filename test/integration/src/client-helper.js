const cnaught = require('../../../dist/src/api-client');
const configHelper = require('./config-helper');

module.exports = {
    getApiClient: (apiKey = configHelper.getApiKey()) => {
        const client = new cnaught.CNaughtApiClient(apiKey, configHelper.getApiHostname());
        return client;
    }
}
