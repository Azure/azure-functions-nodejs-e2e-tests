// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { CosmosClient } from '@azure/cosmos';
import { waitForOutput } from './global.test';
import { getRandomHexString } from './utils/getRandomHexString';
import { nonNullProp } from './utils/nonNull';

describe('cosmosDB', () => {
    const connectionString = nonNullProp(process.env, 'e2eTest_cosmosDB');

    it('trigger and output', async () => {
        const client = new CosmosClient(connectionString);
        const container = client.database('e2eTestDB').container('e2eTestContainer1');
        const message = getRandomHexString();
        await container.items.create({ message });

        await waitForOutput(`cosmosDBTrigger1 processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger1 was triggered by "${message}"`);
        await waitForOutput(`cosmosDBTrigger2 processed 1 documents`);
        await waitForOutput(`cosmosDBTrigger2 was triggered by "${message}"`);
    });
});
