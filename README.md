# [CNaught Node SDK](https://docs.cnaught.com/sdks/node/)

[![Build Status](https://github.com/CNaught-Inc/cnaught-node-sdk/actions/workflows/build_test.yml/badge.svg?branch=main)](https://github.com/CNaught-Inc/cnaught-node-sdk/actions/workflows/build_test.yml)
[![NPM Version](https://img.shields.io/npm/v/%40cnaught%2Fcnaught-node-sdk)](https://www.npmjs.com/package/@cnaught/cnaught-node-sdk)
[![Software License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://github.com/cnaught-inc/cnaught-node-sdk/blob/main/LICENSE)

## Documentation

See the [API docs](https://docs.cnaught.com) for more information about the API.

## Examples

Examples can be found in the [`examples/`](https://github.com/cnaught-inc/cnaught-node-sdk/tree/main/examples) directory

## Installation

To install the package, run:

    npm install @cnaught/cnaught-node-sdk

Yarn, pnpm, bun will also work.

## Support

We support Node 18+. The SDK can also be used in edge environments like Next.js edge runtime - any runtime 
that supports `fetch` should work.

## Usage

All you need to get started is your API Key, which can be generated on
your [Developers page](https://app.cnaught.com/apikeys). Create a client with the
given API Key:

```javascript
import { CNaughtApiClient } from "@cnaught/cnaught-node-sdk";

// Initialize your client with your CNaught API key
const apiKey = "Your API Key";
const client = new CNaughtApiClient(apiKey);
```

### Placing an order

Once you've set up your client with your API Key, placing an Offsets Order is easy

```javascript
// ride order
const order = await client.placeRideOrder({ distance_km: 10 });

// or a generic order
const order = await client.placeGenericOrder({ amount_kg: 20 });
```

`order` will contain all the information normally found in a successful response from our
[Place Order](https://docs.cnaught.com/api/reference/#operation/SubmitOrder) endpoint.

### Checking your order status

You can check the status of your order using its `id`

```javascript
const orderDetails = await client.getOrderDetails(order.id);
```

`orderDetails` will contain all information normally found in a successful response from
our [Get Order By Id](https://docs.cnaught.com/api/reference/#operation/GetOrderById) endpoint

### Getting order history

You can retrieve a list of orders with optional parameters

```javascript
const orders = await client.getListOfOrders();

// limit amount of retrieved orders
const orders = await client.getListOfOrders(3);

// get orders starting after a certain orders id
const orders = await client.getListOfOrders(undefined, "Umx5c6F7pH7r");
```

`orders` will contain a list of orders details having all information normally found in a successful response
from our [Get List of Orders](https://docs.cnaught.com/api/reference/#operation/GetListOfOrder) endpoint

### Impact data

You can retrieve data summarizing the total impact of your orders, as well as the configuration for your
account's hosted impact page

```javascript
const impactData = await client.getImpactData();
const impactHostedPageConfig = await client.getImpactHostedPageConfig();
console.log(`${impactData.name} has offset a total amount of ${impactData.total_offset_kgs} kg CO2e since ${impactData.since_date}`);
console.log(`This is the same as ${impactData.equivalents.cars_off_the_road} cars off the road`);
console.log(`To see more, visit ${impactHostedPageConfig.url}`);
```

### Subaccounts

Subaccounts can be used to segregate your orders. For example, you could segregate orders by department.

We will need to provision your account for Subaccount support before you can create subaccounts. Please contact
`support@cnaught.com` if you would like to use this feature.

```javascript
// create a new subaccount
const subaccount = await client.createSubaccount({ name: 'Sales team travel' });

// list subaccounts in your account. pagination works the same way as for orders. 
const subaccounts = await client.getListOfSubaccounts();

// place an order for a specific subaccount
const order = await client.placeGenericOrder({ amount_kg: 20 }, { subaccountId: subaccount.id });

// retrieve the impact data for a specific subaccount 
const impactData = await client.getImpactData({ subaccountId: subaccount.id });
```

### Customizing the API client

The API client can be customized with control where and how API requests are made:

```javascript
import { CNaughtApiClient } from "@cnaught/cnaught-node-sdk";

const loggingFetch: typeof fetch = async (request, init) => {
   console.log('fetch params were', request, init);
   return fetch(request, init);
};
const client = new CNaughtApiClient("Your API Key", { 
    hostname: 'api.cnaught.com',
    port: 443,
    version: 'v1',
    fetch: loggingFetch 
});
```

| Option       | Default             | Description                                                          |
|--------------|---------------------|----------------------------------------------------------------------|
| `hostname`   | `'api.cnaught.com'` | Host that requests are made to.                                      |
| `port`       | 443                 | Port that requests are made to.                                      |
| `apiVersion` | `'v1'`              | CNaught API version to be used. `v1` is currently the only valid version |
| `fetch`      | `null`              | Allows passing a custom `fetch` implementation, such as a polyfill.  |

### Passing additional per-request options to fetch

All api methods support passing additional `fetch` options, which are passed through to `fetch`. This is useful
in environments that extend `fetch` with framework-specific options, like Next.js:

```javascript
import { CNaughtApiClient } from "@cnaught/cnaught-node-sdk";

const client = new CNaughtApiClient("Your API Key");
const impactData = client.getImpactData({ 
   extraRequestOptions: {
       next: { revalidate: 10000 }
   }
});
```

# For CNaught Node SDK Developers

After cloning and installing required npm modules, you should follow these practices when developing:

1. Use the scripts defined in [package.json](https://github.com/cnaught-inc/cnaught-node-sdk/tree/main/package.json) in this manner `npm run [command_name]`:
   * `lint` checks that you are not violating any code style standards. This ensures our code's style quality stays high improving readability and reducing room for errors.
   * `build` transpiles the Typescript into Javascript with the options specified in [tsconfig.json](https://github.com/cnaught-inc/cnaught-node-sdk/tree/main/tsconfig.json)
   * `unit-test` runs our unit tests which live in the [unit test directory](https://github.com/cnaught-inc/cnaught-node-sdk/tree/main/test/unit).
   * `integration-test` runs our integration tests which live in the [integration test directory](https://github.com/cnaught-inc/cnaught-node-sdk/tree/main/test/integration). Integration tests expect to run against the [Sandbox](https://docs.cnaught.com/api/#sandbox-mode).
2. Add any relevant tests if you add or modify any features in the source code and check that the tests pass using the scripts mentioned above.
3. Update the examples provided to illustrate any relevant changes you made, and check that they work properly with your changed local `cnaught-node-sdk`.
   - Examples are configured to automatically use the local version of the package.
4. Update the documentation to reflect any relevant changes.
