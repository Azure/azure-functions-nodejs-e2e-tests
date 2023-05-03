// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { waitForOutput } from './global.test';
import { eventHubConnectionString } from './resources/connectionStrings';
import { eventHubMany, eventHubOne } from './resources/eventHub';
import { getRandomHexString } from './utils/getRandomHexString';

describe('eventHub', () => {
    it('event hub cardinality one', async () => {
        const message = getRandomHexString();
        const client = new EventHubProducerClient(eventHubConnectionString, eventHubOne);
        await client.sendBatch([{ body: message }]);

        await waitForOutput(`eventHubTriggerOne was triggered by "${message}"`);
    });

    it('event hub cardinality many', async () => {
        const message = getRandomHexString();
        const message2 = getRandomHexString();
        const client = new EventHubProducerClient(eventHubConnectionString, eventHubMany);
        await client.sendBatch([{ body: message }, { body: message2 }]);

        await waitForOutput(`eventHubTriggerMany processed 2 messages`);
        await waitForOutput(`eventHubTriggerMany was triggered by "${message}"`);
        await waitForOutput(`eventHubTriggerMany was triggered by "${message2}"`);
    });
});
