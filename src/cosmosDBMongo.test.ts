// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { MongoClient } from 'mongodb';
import { getFuncUrl, CosmosDBMongo } from './constants';
import { waitForOutput } from './global.test';
import { cosmosDBMongoConnectionString } from './utils/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';

describe('cosmosDBMongo', () => {
    let client: MongoClient;

    before(async () => {
        client = new MongoClient(cosmosDBMongoConnectionString);
        await client.connect();
    });

    after(async () => {
        await client.close();
    });

    it('trigger and output via change stream', async () => {
        const collection = client
            .db(CosmosDBMongo.dbName)
            .collection(CosmosDBMongo.triggerAndOutputCollectionName);

        const testData = getRandomTestData();
        const result = await collection.insertOne({ testData });

        await waitForOutput(`cosmosDBMongoTriggerAndOutput saw "${testData}"`);
        await waitForOutput(`cosmosDBMongoTrigger saw "${testData}"`);

        const url = `${getFuncUrl('httpTriggerCosmosDBMongoInput')}?id=${result.insertedId}`;
        const response = await fetch(url);
        const body = await response.text();
        expect(body).to.equal(testData);
    });

    it('extra output via http', async () => {
        const url = getFuncUrl('httpTriggerCosmosDBMongoOutput');

        const singleData = getRandomTestData();
        const singleDoc = { testData: singleData };
        await fetch(url, { method: 'POST', body: JSON.stringify(singleDoc) });
        await waitForOutput(`cosmosDBMongoTrigger saw "${singleData}"`);

        const bulkDocs = Array.from({ length: 3 }, () => {
            const data = getRandomTestData();
            return { testData: data };
        });
        await fetch(url, { method: 'POST', body: JSON.stringify(bulkDocs) });
        for (const doc of bulkDocs) {
            await waitForOutput(`cosmosDBMongoTrigger saw "${doc.testData}"`);
        }
    });
});
