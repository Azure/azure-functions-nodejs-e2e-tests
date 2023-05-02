// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { waitForOutput } from './global.test';
import { getRandomHexString } from './utils/getRandomHexString';
import { nonNullProp } from './utils/nonNull';

describe('eventHub', () => {
    const connectionString = nonNullProp(process.env, 'e2eTest_eventHub');

    it('event hub cardinality one', async () => {
        const message = getRandomHexString();
        const client = new EventHubProducerClient(connectionString, 'e2etesteventhubone');
        await client.sendBatch([{ body: message }]);

        await waitForOutput(`eventHubTriggerOne was triggered by "${message}"`);
    });

    it('event hub cardinality many', async () => {
        const message = getRandomHexString();
        const message2 = getRandomHexString();
        const client = new EventHubProducerClient(connectionString, 'e2etesteventhubmany');
        await client.sendBatch([{ body: message }, { body: message2 }]);

        await waitForOutput(`eventHubTriggerMany processed 2 messages`);
        await waitForOutput(`eventHubTriggerMany was triggered by "${message}"`);
        await waitForOutput(`eventHubTriggerMany was triggered by "${message2}"`);
    });
});
