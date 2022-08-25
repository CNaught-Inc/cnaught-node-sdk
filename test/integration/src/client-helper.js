const configHelper = require('./config-helper');
const cnaught = require('../../../dist/src/api-client');
const OrderState = require('../../../dist/src/models/OrderState').OrderState;
const OrderType = require('../../../dist/src/models/OrderType').OrderType;

module.exports = {
    getApiClient: (apiKey = configHelper.getApiKey()) => {
        const client = new cnaught.CNaughtApiClient(apiKey, configHelper.getApiHostname());
        return client;
    }
}
