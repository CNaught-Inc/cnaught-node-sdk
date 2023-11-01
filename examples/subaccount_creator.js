/* eslint-disable max-len */
import { randomUUID } from 'crypto';
import { CNaughtApiClient, CNaughtError } from '@cnaught/cnaught-node-sdk';
import inquirer from 'inquirer';
import 'dotenv/config';

(async () => {
    // Initialize your client with your CNaught API key
    const client = new CNaughtApiClient(process.env.CNAUGHT_API_KEY, {
        hostname: 'api-local.cnaught.com',
        port: 3011
    });

    const subaccounts = await client.getListOfSubaccounts();
    let subaccountId = null;

    const name = (
        await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Name for new subaccount'
        })
    ).name;

    try {
        const subaccount = await client.createSubaccount(
            {
                name
            },
            { idempotencyKey: randomUUID() }
        );
        console.log(`Subaccount created with id: ${subaccount.id}`);
    } catch (err) {
        if (err instanceof CNaughtError) {
            switch (err.problemDetails.type) {
                case 'https://api.cnaught.com/v1/errors/invalid-parameters':
                    console.log(
                        'Parameters did not validate',
                        err.problemDetails.errors
                    );
                    break;
                case 'https://api.cnaught.com/v1/errors/not-found':
                    console.log(
                        'Could not find something',
                        err.problemDetails.title
                    );
                    break;
                default:
                    console.log('CNaught error', err.problemDetails.title);
                    break;
            }
        } else {
            console.log('Generic error', err);
        }
    }
})();
