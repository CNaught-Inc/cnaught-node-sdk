/* eslint-disable max-len */
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

    let portfolioId = (await inquirer.prompt({
        type: 'input',
        name: 'portfolioId',
        message: 'Id of portfolio to use (leave blank for default portfolio)?'
    })).portfolioId;
    if (portfolioId === '') {
        portfolioId = null;
    }

    console.log(`You requested offsets for a ${distance} km ride, using portfolio ${portfolioId ?? 'default'} to fulfill`);

    try {
        const quote = await client.getRideQuote({ distance_km: distance, portfolio_id: portfolioId });

        console.log(`The ammount of CO2 emitted was ${quote.amount_kg} kg and price is $${quote.price_usd_cents / 100}`);

        const shouldBuy = (await inquirer.prompt({
            type: 'confirm',
            name: 'shouldBuy',
            message: `amount of CO2 is ${quote.amount_kg} kg and price is $${quote.price_usd_cents / 100}. Purchase?`,
            default: true
        })).shouldBuy;

        // submit a ride order if confirmed
        if (shouldBuy) {
            const order = await client.placeRideOrder({ distance_km: 10, portfolio_id: portfolioId, description: description });
            console.log(`Order placed, with id: ${order.id}. View certificate at: ${order.certificate_public_url} and download at ${order.certificate_download_public_url}`);
        } else {
            console.log('Maybe next time');
        }
    } catch(err) {
        if (err.details?.title) {
            console.log(err.details.title);
        } else {
            console.log('Error occurred');
            console.dir(err);
        }
    }
})();

