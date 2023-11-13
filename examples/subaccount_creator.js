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
