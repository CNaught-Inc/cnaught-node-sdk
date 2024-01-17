/* eslint-disable max-len */
import { CNaughtApiClient } from '@cnaught/cnaught-node-sdk';
import inquirer from 'inquirer';
import 'dotenv/config';

(async () => {
    // Initialize your client with your CNaught API key
    const client = new CNaughtApiClient(process.env.CNAUGHT_API_KEY);

    const orderId = (
        await inquirer.prompt({
            type: 'input',
            name: 'orderId',
            message: 'ID of order to cancel?'
        })
    ).orderId;

    console.log(`You requested cancellation of order ${orderId}`);

    try {
        const order = await client.cancelOrder(orderId);
        console.log(`Order ${order.id} canceled.`);
        console.log('Updated order is %j', order);
    } catch (err) {
        console.log('Error occurred while canceling');
        console.dir(err);
    }
})();
