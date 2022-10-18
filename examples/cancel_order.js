/* eslint-disable max-len */
const cnaught = require('@cnaught/cnaught-node-sdk');
const inquirer = require('inquirer');
require('dotenv').config();

(async () => {
    // Initialize your client with your CNaught API key
    const client = new cnaught.CNaughtApiClient(process.env.CNAUGHT_API_KEY);

    const orderId = (await inquirer.prompt({
        type: 'input',
        name: 'orderId',
        message: 'ID of order to cancel?'
    })).orderId;

    console.log(`You requested cancellation of order ${orderId}`);

    try {
        const order = await client.cancelOrder(orderId);
        console.log(`Order ${order.id} canceled.`);
        console.log('Updated order is %j', order);
    } catch(err) {
        console.log('Error occurred while canceling');
        console.dir(err);
    }
})();

