// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { CosmosClient } from '@azure/cosmos';
import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { CosmosDB, getFuncUrl, jsonContentTypeHeaders } from './constants';
import { waitForOutput } from './global.test';
import { cosmosDBConnectionString } from './utils/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';

describe('cosmosDB', () => {
    it('trigger, output, input', async () => {
        const client = new CosmosClient(cosmosDBConnectionString);
        const container = client.database(CosmosDB.dbName).container(CosmosDB.triggerAndOutputContainerName);
        const testData = getRandomTestData();
        const createdItem = await container.items.create({ testData, testPartKey: CosmosDB.partitionKey });

        await waitForOutput(`cosmosDBTriggerAndOutput processed 1 documents`);
        await waitForOutput(`cosmosDBTriggerAndOutput was triggered by "${testData}"`);
        await waitForOutput(`cosmosDBTrigger processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger was triggered by "${testData}"`);

        const url = getFuncUrl('httpTriggerCosmosDBInput', { id: createdItem.item.id });
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
        const url = getFuncUrl('httpTriggerCosmosDBOutput');

        // single doc
        const singleDoc = getDoc();
        await fetch(url, { method: 'POST', headers: jsonContentTypeHeaders, body: JSON.stringify(singleDoc) });
        await waitForOutput(`cosmosDBTrigger was triggered by "${singleDoc.testData}"`);

        // bulk docs
        const bulkDocs: Doc[] = [];
        for (let i = 0; i < 5; i++) {
            bulkDocs.push(getDoc());
        }
        await fetch(url, { method: 'POST', headers: jsonContentTypeHeaders, body: JSON.stringify(bulkDocs) });
        for (const doc of bulkDocs) {
            await waitForOutput(`cosmosDBTrigger was triggered by "${doc.testData}"`);
        }
    });

    it('input and output reject invalid payloads and missing resources', async () => {
        // Binding-backed input routes intentionally do not assert omitted-id 400s because
        // the host resolves {Query.id} before the function code can validate it.
        const missingDocResponse = await fetch(getFuncUrl('httpTriggerCosmosDBInput', { id: getRandomTestData() }));
        expect(missingDocResponse.status).to.equal(404);

        const invalidWriteResponse = await fetch(getFuncUrl('httpTriggerCosmosDBOutput'), {
            method: 'POST',
            headers: jsonContentTypeHeaders,
            body: JSON.stringify({ testData: getRandomTestData() }),
        });
        expect(invalidWriteResponse.status).to.equal(400);
    });
});
