// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { getFuncUrl } from './constants';
import { isOldConfig, model, waitForOutput } from './global.test';
import { cosmosDBMongoConnectionString } from './utils/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';

describe('cosmosDBMongo', () => {
    before(function (this: Mocha.Context) {
        if (model !== 'v4' || isOldConfig || !cosmosDBMongoConnectionString) {
            this.skip();
        }
    });

    type Doc = { _id: string; testData: string };

    function getDoc(): Doc {
        const data = getRandomTestData();
        return { _id: data, testData: data };
    }

    it('trigger, output, input', async () => {
        const document = getDoc();
        const outputResponse = await fetch(getFuncUrl('httpTriggerCosmosDBMongoOutput'), {
            method: 'POST',
            body: JSON.stringify(document),
        });
        expect(outputResponse.status).to.equal(200);

        await waitForOutput(`cosmosDBMongoTrigger was triggered by "${document.testData}"`);

        const inputResponse = await fetch(
            `${getFuncUrl('httpTriggerCosmosDBMongoInput')}?id=${encodeURIComponent(document._id)}`
        );
        expect(inputResponse.status).to.equal(200);
        const body = await inputResponse.json();
        expect(body).to.include(document);
    });

    it('bulk output triggers once per document', async () => {
        const documents: Doc[] = [];
        for (let i = 0; i < 3; i++) {
            documents.push(getDoc());
        }

        const outputResponse = await fetch(getFuncUrl('httpTriggerCosmosDBMongoOutput'), {
            method: 'POST',
            body: JSON.stringify(documents),
        });
        expect(outputResponse.status).to.equal(200);

        for (const document of documents) {
            await waitForOutput(`cosmosDBMongoTrigger was triggered by "${document.testData}"`);
        }
    });
});
