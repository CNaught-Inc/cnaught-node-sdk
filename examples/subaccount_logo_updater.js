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
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

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

        const updateAction = (
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
                        name: 'Grab a new logo from a URL',
                        value: 'update-from-url'
                    },
                    {
                        name: 'Remove the logo',
                        value: 'remove'
                    }
                ]
            })
        ).updateAction;

        let updatedSubaccount;
        let logoUrl;
        let logoFilePath;
        switch (updateAction) {
            case 'update-from-file':
                logoFilePath = (
                    await inquirer.prompt([
                        {
                            type: 'file-tree-selection',
                            name: 'file',
                            message: 'choose the logo image file',
                            enableGoUpperDirectory: true
                        }
                    ])
                ).file;
                console.log('Updating logo using file', logoFilePath);
                updatedSubaccount =
                    await client.updateSubaccountLogoFromImageData(
                        subaccount.id,
                        {
                            logo_file_content:
                                fs.createReadStream(logoFilePath),
                            content_type: 'image/png'
                        },
                        { idempotencyKey: randomUUID() }
                    );
                break;
            case 'update-from-url':
                console.log('update from url');
                logoUrl = (
                    await inquirer.prompt({
                        type: 'input',
                        name: 'logoUrl',
                        message:
                            'URL for logo for new subaccount (blank if none)'
                    })
                ).logoUrl;
                console.log('Updating logo using url', logoUrl);
                updatedSubaccount = await client.updateSubaccountLogoFromUrl(
                    subaccount.id,
                    {
                        logo_url: logoUrl
                    },
                    { idempotencyKey: randomUUID() }
                );
                break;
            case 'remove':
                console.log('Removing logo');
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
