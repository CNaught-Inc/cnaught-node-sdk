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

    try {
        const portfolios = await client.getListOfPortfolios();
        let portfolioId = (
            await inquirer.prompt({
                type: 'list',
                message: 'Choose a portfolio to explore',
                name: 'portfolio',
                choices: portfolios.data.map((s) => ({
                    name: s.name,
                    value: s.id
                }))
            })
        ).portfolio;

        const portfolioDetails = await client.getPortfolioDetails(portfolioId);
        console.log(`${portfolioDetails.name}: ${portfolioDetails.summary}`);
        console.log(`   Description: ${portfolioDetails.description}`);
        console.log(`   Primary image: ${portfolioDetails.primary_image_url}`);
        console.log('   Category allocations');
        portfolioDetails.category_allocations.forEach((a) => {
            console.log(
                `     ${a.category.name}: ${a.allocated_fraction * 100}%`
            );
            a.category.projects.forEach((p) => {
                console.log(`       ${p.name}`);
            });
        });
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
