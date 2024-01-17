/* eslint-disable max-len */
import {
    CNaughtApiClient,
    CNaughtError,
    invalidParametersProblemType
} from '@cnaught/cnaught-node-sdk';
import inquirer from 'inquirer';
import 'dotenv/config';

(async () => {
    // Initialize your client with your CNaught API key
    const client = new CNaughtApiClient(process.env.CNAUGHT_API_KEY, {
        hostname: 'api-stage.cnaught.com'
    });

    const orderId = (
        await inquirer.prompt({
            type: 'input',
            name: 'orderId',
            message: 'ID of order to show details?'
        })
    ).orderId;

    try {
        const order = await client.getOrderDetails(orderId);
        console.log(`Order ${order.id} status: ${order.state}`);
        if (order.project_allocations.length > 0) {
            console.log('   allocated projects');
            order.project_allocations.forEach((pa) => {
                console.log(`     Amount: ${pa.amount_kg} kg TCO2e`);
                console.log(`     Name: ${pa.project.name}`);
                console.log(`     Type: ${pa.project.type}`);
                console.log(`     Developer: ${pa.project.developer}`);
                console.log(
                    `     Registry: ${pa.project.registry_name} - ${pa.project.registry_id} - ${pa.project.registry_url}`
                );
                console.log(
                    `     Location: ${pa.project.location_name} - (${pa.project.location_latitude}, ${pa.project.location_longitude})`
                );
                console.log(`     Summary: ${pa.project.summary}`);
                console.log(`     Description: ${pa.project.description}`);
                console.log(`     Image: ${pa.project.primary_image_url}`);
                console.log(
                    `     UN SDG Goals: ${pa.project.un_sdg_goals.join(',')}`
                );
                if (pa.retirements.length > 0) {
                    console.log('     retirements');
                    pa.retirements.forEach((r) => {
                        console.log(
                            `       ${r.serial_number_range} - ${r.url}`
                        );
                    });
                }
                console.log('     ----------------------------------');
            });
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
