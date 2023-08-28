// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { CosmosClient } from '@azure/cosmos';
import { expect } from 'chai';
import { getFuncUrl } from './constants';
import { waitForOutput } from './global.test';
import { cosmosDBConnectionString } from './resources/connectionStrings';
import { container1Name, dbName } from './resources/cosmosDB';
import { getRandomTestData } from './utils/getRandomTestData';

describe('cosmosDB', () => {
    it('trigger, output, input', async () => {
        const client = new CosmosClient(cosmosDBConnectionString);
        const container = client.database(dbName).container(container1Name);
        const message = getRandomTestData();
        const createdItem = await container.items.create({ message });

        await waitForOutput(`cosmosDBTrigger1 processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger1 was triggered by "${message}"`);
        await waitForOutput(`cosmosDBTrigger2 processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger2 was triggered by "${message}"`);

        const url = `${getFuncUrl('cosmosDBInput1')}?id=${createdItem.item.id}`;
        const response = await fetch(url);
        const body = await response.text();
        expect(body).to.equal(message);
    });
});
