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

    try {
        const subaccounts = await client.getListOfSubaccounts();
        if (subaccounts.data.length == 0) {
            console.log('This user does not have any subaccounts');
            return;
        }
        let subaccountId = (
            await inquirer.prompt({
                type: 'list',
                message: 'Subaccount to update',
                name: 'subaccount',
                choices: subaccounts.data.map((s) => ({
                    name: s.name,
                    value: s.id
                }))
            })
        ).subaccount;

        const subaccount = await client.getSubaccountDetails(subaccountId);
        console.log(`Current subaccount logo: ${subaccount.logo_url}`);

        const updateAction =
            (
                await inquirer.prompt({
                    type: 'list',
                    message: 'What update should be made to the logo?',
                    name: 'updateAction',
                    choices: [
                        {
                            name: 'Use a local file to upload new logo',
                            value: 'update-from-file'
                        },
                        {
                            subaccount: 'Grab a new logo from a URL',
                            value: 'update-from-url'
                        },
                        {
                            subaccount: 'Remove the logo',
                            value: 'remove'
                        }
                    ]
                })
            ).updateAction === 'file';

        let updatedSubaccount;
        let logoUrl;
        switch (updateAction) {
            case 'update-from-file':
                updatedSubaccount =
                    await client.updateSubaccountLogoFromImageData(
                        subaccount.id,
                        {
                            logo_file_content: fs.createReadStream(
                                '/Users/dkokotov/Downloads/logo.png'
                            ),
                            content_type: 'image/png'
                        },
                        { idempotencyKey: randomUUID() }
                    );
                break;
            case 'update-from-url':
                logoUrl = (
                    await inquirer.prompt({
                        type: 'input',
                        name: 'logoUrl',
                        message:
                            'URL for logo for new subaccount (blank if none)'
                    })
                ).logoUrl;

                updatedSubaccount = await client.updateSubaccountLogoFromUrl(
                    subaccount.id,
                    {
                        logo_url: logoUrl
                    },
                    { idempotencyKey: randomUUID() }
                );
                break;
            case 'remove':
                updatedSubaccount = await client.removeSubaccountLogo(
                    subaccount.id,
                    { idempotencyKey: randomUUID() }
                );
        }

        console.log(`Subaccount after uploading logo`, updatedSubaccount);
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
