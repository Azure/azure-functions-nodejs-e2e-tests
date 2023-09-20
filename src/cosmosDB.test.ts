// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { CosmosClient } from '@azure/cosmos';
import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { getFuncUrl } from './constants';
import { waitForOutput } from './global.test';
import { cosmosDBConnectionString } from './resources/connectionStrings';
import { container1Name, dbName } from './resources/cosmosDB';
import { getRandomTestData } from './utils/getRandomTestData';

describe('cosmosDB', () => {
    it('trigger, output, input', async () => {
        const client = new CosmosClient(cosmosDBConnectionString);
        const container = client.database(dbName).container(container1Name);
        const testData = getRandomTestData();
        const createdItem = await container.items.create({ testData, _partitionKey: 'testPartKey' });

        await waitForOutput(`cosmosDBTrigger1 processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger1 was triggered by "${testData}"`);
        await waitForOutput(`cosmosDBTrigger2 processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger2 was triggered by "${testData}"`);

        const url = `${getFuncUrl('cosmosDBInput1')}?id=${createdItem.item.id}`;
        const response = await fetch(url);
        const body = await response.text();
        expect(body).to.equal(testData);
    });

    it('extra output', async () => {
        type Doc = { id: string; testData: string };
        function getDoc(): Doc {
            const data = getRandomTestData();
            return { id: data, testData: data };
        }
        const url = getFuncUrl('cosmosDBOutput1');

        // single doc
        const singleDoc = getDoc();
        await fetch(url, { method: 'POST', body: JSON.stringify(singleDoc) });
        await waitForOutput(`cosmosDBTrigger2 was triggered by "${singleDoc.testData}"`);

        // bulk docs
        const bulkDocs: Doc[] = [];
        for (let i = 0; i < 5; i++) {
            bulkDocs.push(getDoc());
        }
        await fetch(url, { method: 'POST', body: JSON.stringify(bulkDocs) });
        for (const doc of bulkDocs) {
            await waitForOutput(`cosmosDBTrigger2 was triggered by "${doc.testData}"`);
        }
    });
});
