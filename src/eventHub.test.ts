// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { waitForOutput } from './global.test';
import { eventHubConnectionString } from './resources/connectionStrings';
import { eventHubMany1, eventHubOne1 } from './resources/eventHub';
import { getRandomTestData } from './utils/getRandomTestData';

describe('eventHub', () => {
    let clientOne: EventHubProducerClient;
    let clientMany: EventHubProducerClient;

    before(() => {
        clientOne = new EventHubProducerClient(eventHubConnectionString, eventHubOne1);
        clientMany = new EventHubProducerClient(eventHubConnectionString, eventHubMany1);
    });

    after(async () => {
        await Promise.all([clientOne.close(), clientMany.close()]);
    });

    it('trigger and output, cardinality one', async () => {
        const message = getRandomTestData();
        await clientOne.sendBatch([{ body: message }]);

        await waitForOutput(`eventHubTriggerOne1 was triggered by "${message}"`);
        await waitForOutput(`eventHubTriggerOne2 was triggered by "${message}"`);
    });

    it('trigger and output, cardinality many', async () => {
        const message = getRandomTestData();
        const message2 = getRandomTestData();
        await clientMany.sendBatch([{ body: message }, { body: message2 }]);

        await waitForOutput(`eventHubTriggerMany1 was triggered by "${message}"`);
        await waitForOutput(`eventHubTriggerMany1 was triggered by "${message2}"`);
        await waitForOutput(`eventHubTriggerMany2 was triggered by "${message}"`);
        await waitForOutput(`eventHubTriggerMany2 was triggered by "${message2}"`);
    });
});
