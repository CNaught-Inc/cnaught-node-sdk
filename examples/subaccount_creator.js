/* eslint-disable max-len */
import { randomUUID } from 'crypto';
import {
    CNaughtApiClient,
    CNaughtError,
    invalidParametersProblemType
} from '@cnaught/cnaught-node-sdk';
import inquirer from 'inquirer';
import 'dotenv/config';
import fs from 'node:fs';

(async () => {
    // Initialize your client with your CNaught API key
    const client = new CNaughtApiClient(process.env.CNAUGHT_API_KEY, {
        hostname: 'api-stage.cnaught.com'
    });

    const name = (
        await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Name for new subaccount'
        })
    ).name;

    const logoUrl = (
        await inquirer.prompt({
            type: 'input',
            name: 'logoUrl',
            message: 'URL for logo for new subaccount (blank if none)'
        })
    ).logoUrl;

    const portfolios = await client.getListOfPortfolios();
    let portfolioId = (
        await inquirer.prompt({
            type: 'list',
            message: 'Default portfolio for subaccount',
            name: 'portfolio',
            choices: portfolios.data
                .map((s) => ({
                    name: s.name,
                    value: s.id
                }))
                .concat([
                    {
                        name: "[Use parent user's default portolio]",
                        value: null
                    }
                ])
        })
    ).portfolio;

    try {
        const subaccount = await client.createSubaccount(
            {
                name,
                logo_url: logoUrl,
                default_portfolio_id: portfolioId
            },
            { idempotencyKey: randomUUID() }
        );
        console.log(`Subaccount created`, subaccount);
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
