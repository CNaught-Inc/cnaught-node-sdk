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

    const projectCategoryId = (
        await inquirer.prompt({
            type: 'input',
            name: 'projectCategoryId',
            message: 'ID of project category to show details?'
        })
    ).projectCategoryId;

    try {
        const projectCategory = await client.getProjectCategoryDetails(
            projectCategoryId
        );
        console.log(`${projectCategory.name}`);
        console.log(`   Description: ${projectCategory.description}`);
        console.log(`   Image: ${projectCategory.primary_image_url}`);
        console.log(`   Projects`);
        projectCategory.projects.forEach((project) => {
            console.log(`     ${project.name}`);
            console.log(`       Type: ${project.type}`);
            console.log(`       Developer: ${project.developer}`);
            console.log(
                `       Registry: ${project.registry_name} - ${project.registry_id} - ${project.registry_url}`
            );
            console.log(
                `       Location: ${project.location_name} - (${project.location_latitude}, ${project.location_longitude})`
            );
            console.log(`       Summary: ${project.summary}`);
            console.log(`       Description: ${project.description}`);
            console.log(`       Image: ${project.primary_image_url}`);
            console.log(
                `       UN SDG Goals: ${project.un_sdg_goals.join(',')}`
            );
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
