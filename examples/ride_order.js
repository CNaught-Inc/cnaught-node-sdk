/* eslint-disable max-len */
const { randomUUID } = require('crypto');
const cnaught = require('@cnaught/cnaught-node-sdk');
const inquirer = require('inquirer');
require('dotenv').config();

(async () => {
    // Initialize your client with your CNaught API key
    const client = new cnaught.CNaughtApiClient(process.env.CNAUGHT_API_KEY);

    const distance = (await inquirer.prompt({
        type: 'input',
        name: 'distance',
        message: 'How long was your ride (in km)?',
        validate(value) {
            const valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    })).distance;

    const onBehalf = (await inquirer.prompt({
        type: 'input',
        name: 'onBehalf',
        message: 'Who are you buying this for?'
    })).onBehalf;
    const description = onBehalf !== '' ? `On behalf of ${onBehalf}` : null;

    console.log(`You requested offsets for a ${distance} km ride`);

    const quote = await client.getRideQuote({ distance_km: distance });

    console.log(`The ammount of CO2 emitted was ${quote.amount_kg} kg and price is $${quote.price_usd_cents / 100}`);

    const shouldBuy = (await inquirer.prompt({
        type: 'confirm',
        name: 'shouldBuy',
        message: `amount of CO2 is ${quote.amount_kg} kg and price is $${quote.price_usd_cents / 100}. Purchase?`,
        default: true
    })).shouldBuy;

    // submit a ride order if confirmed
    if (shouldBuy) {
        const order = await client.placeRideOrder({ distance_km: 10, description: description }, { idempotencyKey: randomUUID() });
        console.log(`Order placed, with id: ${order.id}. View certificate at: ${order.certificate_public_url} and download at ${order.certificate_download_public_url}`);
    } else {
        console.log('Maybe next time');
    }
})();

