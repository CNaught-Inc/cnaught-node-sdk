# [CNaught Node SDK](https://docs.cnaught.com/sdk/node/) 

[![Build Status](https://github.com/CNaught-Inc/cnaught-node-sdk/actions/workflows/build_test.yml/badge.svg?branch=main)](https://github.com/CNaught-Inc/cnaught-node-sdk/actions/workflows/build_test.yml)
[![npm version](https://badge.fury.io/js/%40cnaught%2Fcnaught-node-sdk@2x.svg)](https://www.npmjs.com/package/@cnaught/cnaught-node-sdk)
[![Software License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://github.com/cnaught-inc/cnaught-node-sdk/blob/main/LICENSE)

## Documentation

See the [API docs](https://docs.cnaught.com) for more information about the API.

## Examples

Examples can be found in the [`examples/`](https://github.com/cnaught-inc/cnaught-node-sdk/tree/develop/examples) directory

## Installation

To install the package, run:

    npm install @cnaught/cnaught-node-sdk 

## Support

We support Node 12+

## Usage

All you need to get started is your API Key, which can be generated on
your [API Keys Page](https://app.cnaught.com/apikeys). Create a client with the
given API Key:

```javascript
import { CNaughtApiClient } from '@cnaught/cnaught-node-sdk';

// Initialize your client with your CNaught API key
const apiKey = "Your API Key";
const client = new CNaughtApiClient(apiKey);
```

### Placing an order

Once you've set up your client with your API Key, placing an Offsets Order is easy

```javascript
// ride order
const order = await client.submitRideOrder({ distanceKm: 10 });

// or a generic order
const order = await client.submitGenericOrder({ amountKg: 20 });
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
const orders = await client.getListOfOrders(undefined, 'Umx5c6F7pH7r');
```

`orders` will contain a list of orders details having all information normally found in a successful response
from our [Get List of Orders](https://docs.cnaught.com/api/reference/#operation/GetListOfOrder) endpoint

# For CNaught Node SDK Developers

After cloning and installing required npm modules, you should follow these practices when developing:

1. Use the scripts defined in [package.json](https://github.com/cnaught-inc/cnaught-node-sdk/tree/develop/package.json) in this manner `npm run [command_name]`:
    1. `lint` checks that you are not violating any code style standards. This ensures our code's style quality stays high improving readability and reducing room for errors.
    2. `build` transpiles the Typescript into Javascript with the options specified in [tsconfig.json](https://github.com/cnaught-inc/cnaught-node-sdk/tree/develop/tsconfig.json)
    3. `unit-test` runs our unit tests which live in the [unit test directory](https://github.com/cnaught-inc/cnaught-node-sdk/tree/develop/test/unit).
    4. `build-examples` performs the same action as `build` and in addition, copies the `src` to the `node_modules` directory in `examples` such that you can test examples with local changes.
2. Add any relevant test logic if you add or modify any features in the source code and check that the tests pass using the scripts mentioned above.
3. Update the examples provided to illustrate any relevant changes you made, and check that they work properly with your changed local `cnaught-node-sdk`.
    * One way to use your changed local package in the examples is to copy the output of the `build` script into the `examples/node_modules/cnaught-node-sdk`. On Unix, this can be simply done with the following command when in the root directory: `$ cp -r dist/src examples/node_modules/cnaught-node-sdk/`.
4. Update the documentation to reflect any relevant changes and improve the development section.
