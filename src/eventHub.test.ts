// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { waitForOutput } from './global.test';
import { eventHubConnectionString } from './resources/connectionStrings';
import { eventHubMany, eventHubOne } from './resources/eventHub';
import { getRandomTestData } from './utils/getRandomTestData';

describe('eventHub', () => {
    let clientOne: EventHubProducerClient;
    let clientMany: EventHubProducerClient;

    before(() => {
        clientOne = new EventHubProducerClient(eventHubConnectionString, eventHubOne);
        clientMany = new EventHubProducerClient(eventHubConnectionString, eventHubMany);
    });

    after(async () => {
        await Promise.all([clientOne.close(), clientMany.close()]);
    });

    it('event hub cardinality one', async () => {
        const message = getRandomTestData();
        await clientOne.sendBatch([{ body: message }]);

        await waitForOutput(`eventHubTriggerOne was triggered by "${message}"`);
    });

    it('event hub cardinality many', async () => {
        const message = getRandomTestData();
        const message2 = getRandomTestData();
        await clientMany.sendBatch([{ body: message }, { body: message2 }]);

        await waitForOutput(`eventHubTriggerMany processed 2 messages`);
        await waitForOutput(`eventHubTriggerMany was triggered by "${message}"`);
        await waitForOutput(`eventHubTriggerMany was triggered by "${message2}"`);
    });
});
