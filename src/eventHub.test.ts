// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { waitForOutput } from './global.test';
import { eventHubConnectionString } from './resources/connectionStrings';
import { eventHubManyTriggerAndOutput, eventHubOneTriggerAndOutput } from './resources/eventHub';
import { getRandomTestData } from './utils/getRandomTestData';

describe('eventHub', () => {
    let clientOne: EventHubProducerClient;
    let clientMany: EventHubProducerClient;

    before(() => {
        clientOne = new EventHubProducerClient(eventHubConnectionString, eventHubOneTriggerAndOutput);
        clientMany = new EventHubProducerClient(eventHubConnectionString, eventHubManyTriggerAndOutput);
    });

    after(async () => {
        await Promise.all([clientOne.close(), clientMany.close()]);
    });

    it('trigger and output, cardinality one', async () => {
        const message = getRandomTestData();
        await clientOne.sendBatch([{ body: message }]);

        await waitForOutput(`eventHubOneTriggerAndOutput was triggered by "${message}"`);
        await waitForOutput(`eventHubOneTrigger was triggered by "${message}"`);
    });

    it('trigger and output, cardinality many', async () => {
        const message = getRandomTestData();
        const message2 = getRandomTestData();
        await clientMany.sendBatch([{ body: message }, { body: message2 }]);

        await waitForOutput(`eventHubManyTriggerAndOutput was triggered by "${message}"`);
        await waitForOutput(`eventHubManyTriggerAndOutput was triggered by "${message2}"`);
        await waitForOutput(`eventHubManyTrigger was triggered by "${message}"`);
        await waitForOutput(`eventHubManyTrigger was triggered by "${message2}"`);
    });
});
