/* eslint-disable max-len */
import { randomUUID } from 'crypto';
import {
    CNaughtApiClient,
    CNaughtError,
    invalidParametersProblemType
} from '@cnaught/cnaught-node-sdk';
import inquirer from 'inquirer';
import 'dotenv/config';

(async () => {
    // Initialize your client with your CNaught API key
    const client = new CNaughtApiClient(process.env.CNAUGHT_API_KEY);

    try {
        const subaccounts = await client.getListOfSubaccounts();
        let subaccountId = null;

        if (subaccounts.data.length > 0) {
            const isForSubaccount =
                (
                    await inquirer.prompt({
                        type: 'list',
                        message:
                            'This account contains subaccounts. Should the order be for the main account, or a subaccount?',
                        name: 'mainOrSubaccount',
                        choices: [
                            {
                                name: 'Main account',
                                value: 'main'
                            },
                            {
                                subaccount: 'A subaccount',
                                value: 'subaccount'
                            }
                        ]
                    })
                ).mainOrSubaccount === 'subaccount';

            if (isForSubaccount) {
                subaccountId = (
                    await inquirer.prompt({
                        type: 'list',
                        message: 'Subaccount to use',
                        name: 'subaccount',
                        choices: subaccounts.data.map((s) => ({
                            name: s.name,
                            value: s.id
                        }))
                    })
                ).subaccount;
            }
        }

        const distance = (
            await inquirer.prompt({
                type: 'input',
                name: 'distance',
                message: 'How long was your ride (in km)?',
                validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a number';
                },
                filter: Number
            })
        ).distance;

        const onBehalf = (
            await inquirer.prompt({
                type: 'input',
                name: 'onBehalf',
                message: 'Who are you buying this for?'
            })
        ).onBehalf;
        const description = onBehalf !== '' ? `On behalf of ${onBehalf}` : null;

        let portfolioId = (
            await inquirer.prompt({
                type: 'input',
                name: 'portfolioId',
                message:
                    'Id of portfolio to use (leave blank for default portfolio)?'
            })
        ).portfolioId;
        if (portfolioId === '') {
            portfolioId = null;
        }

        console.log(
            `You requested offsets for a ${distance} km ride, ${
                subaccountId ? `using subaccount ${subaccountId}, ` : ''
            } using portfolio ${portfolioId ?? 'default'} to fulfill`
        );

        const quote = await client.getGroundTransportQuote({
            vehicle_type: 'passenger_car_van_or_suv',
            distance_km: distance,
            portfolio_id: portfolioId
        });

        console.log(
            `The ammount of CO2 emitted was ${
                quote.amount_kg
            } kg and price is $${quote.price_usd_cents / 100}`
        );

        const shouldBuy = (
            await inquirer.prompt({
                type: 'confirm',
                name: 'shouldBuy',
                message: `amount of CO2 is ${
                    quote.amount_kg
                } kg and price is $${quote.price_usd_cents / 100}. Purchase?`,
                default: true
            })
        ).shouldBuy;

        // submit a ride order if confirmed
        if (shouldBuy) {
            const order = await client.placeOrder(
                {
                    amount_kg: quote.amount_kg,
                    portfolio_id: portfolioId,
                    description: description
                },
                { idempotencyKey: randomUUID(), subaccountId }
            );
            console.log(
                `Order placed, with id: ${order.id}. View certificate at: ${order.certificate_public_url} and download at ${order.certificate_download_public_url}`
            );
        } else {
            console.log('Maybe next time');
        }
    } catch (err) {
        if (err instanceof CNaughtError) {
            switch (err.problemDetails.type) {
                case invalidParametersProblemType:
                    console.log(
                        err.problemDetails.title,
                        err.problemDetails.errors
                    );
                    break;
                default:
                    console.log(err.problemDetails.title);
                    break;
            }
        } else {
            console.log('An error occurred', err);
        }
    }
})();
