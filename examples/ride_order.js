const cnaught = require('cnaught-node-sdk');
require('dotenv').config();

(async () => {  
    // Initialize your client with your CNaught API key
    var client = new cnaught.CNaughtApiClient(process.env.CNAUGHT_API_KEY);

    // submit a ride order
    await client.placeRideOrder({ distance_km: 10});

    var orders = await client.getListOfOrders(5, null);
    console.log(orders);
})();

