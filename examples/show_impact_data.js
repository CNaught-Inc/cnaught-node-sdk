/* eslint-disable max-len */
const cnaught = require('@cnaught/cnaught-node-sdk');
const inquirer = require('inquirer');
require('dotenv').config();

(async () => {
    // Initialize your client with your CNaught API key
    const client = new cnaught.CNaughtApiClient(process.env.CNAUGHT_API_KEY, 'api-stage.cnaught.com');

    const subaccounts = await client.getListOfSubaccounts();
    let subaccountId = null;

    if (subaccounts.data.length > 0) {
        const isForSubaccount = (await inquirer.prompt({
            type: 'list',
            message: 'This account contains subaccounts. Should we show impact data for the main account, or a subaccount?',
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
        })).mainOrSubaccount === 'subaccount';

        if (isForSubaccount) {
            subaccountId = (await inquirer.prompt({
                type: 'list',
                message: 'Subaccount to use',
                name: 'subaccount',
                choices: subaccounts.data.map(s => ({
                    name: s.name,
                    value: s.id
                }))
            })).subaccount;
        }
    }

    try {
        const impactData = await client.getImpactData({ subaccountId });
        console.log(`${impactData.name} has offset a total amount of ${impactData.total_offset_kgs} kg CO2e since ${impactData.since_date}`);
        console.log('|- This is the same as');
        console.log(`|--- ${impactData.equivalents.cars_off_the_road} cars off the road`);
        console.log(`|--- ${impactData.equivalents.flights_lax_to_nyc} flights from LA to New York`);
        console.log(`|--- ${impactData.equivalents.trees_planted} trees planted`);
        console.log(`|--- ${impactData.equivalents.homes_annual_energy_usage} homes' annual energy usage`);
        console.log('|- Category details');
        impactData.categories.forEach(c => {
            console.log(`|--- ${c.category.name}: ${c.offset_kgs} kg CO2e`);
            c.projects.forEach(p => {
                console.log(`|----- ${p.project.name}: ${p.offset_kgs} kg CO2e`);
            });
        });
    } catch(err) {
        console.log('Error occurred while retrieving details');
        console.dir(err);
    }
})();

