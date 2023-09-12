// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ServiceBusClient } from '@azure/service-bus';
import { default as fetch } from 'node-fetch';
import { getFuncUrl } from './constants';
import { waitForOutput } from './global.test';
import { serviceBusConnectionString } from './resources/connectionStrings';
import { serviceBusQueue1, serviceBusQueueMany1, serviceBusTopic1 } from './resources/serviceBus';
import { getRandomTestData } from './utils/getRandomTestData';

describe('serviceBus', () => {
    let client: ServiceBusClient;

    before(() => {
        client = new ServiceBusClient(serviceBusConnectionString);
    });

    after(async () => {
        await client.close();
    });

    it('queue trigger and output', async () => {
        const message = getRandomTestData();
        const sender = client.createSender(serviceBusQueue1);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusQueueTrigger1 was triggered by "${message}"`);
        await waitForOutput(`serviceBusQueueTrigger2 was triggered by "${message}"`);
    });

    it('topic trigger and output', async () => {
        const message = getRandomTestData();
        const sender = client.createSender(serviceBusTopic1);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusTopicTrigger1 was triggered by "${message}"`);
        await waitForOutput(`serviceBusTopicTrigger2 was triggered by "${message}"`);
    });

    it('trigger and output, cardinality many', async () => {
        const message1 = getRandomTestData();
        const message2 = getRandomTestData();
        const sender = client.createSender(serviceBusQueueMany1);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message1 });
        batch.tryAddMessage({ body: message2 });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusQueueTriggerMany1 was triggered by "${message1}"`);
        await waitForOutput(`serviceBusQueueTriggerMany1 was triggered by "${message2}"`);
        await waitForOutput(`serviceBusQueueTriggerMany2 was triggered by "${message1}"`);
        await waitForOutput(`serviceBusQueueTriggerMany2 was triggered by "${message2}"`);
    });

    it('extra output', async () => {
        const url = getFuncUrl('serviceBusOutput1');

        // single
        const message = getRandomTestData();
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: message }) });
        await waitForOutput(`serviceBusQueueTrigger2 was triggered by "${message}"`);

        // bulk
        const bulkMsgs: string[] = [];
        for (let i = 0; i < 5; i++) {
            bulkMsgs.push(getRandomTestData());
        }
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: bulkMsgs }) });
        for (const msg of bulkMsgs) {
            await waitForOutput(`serviceBusQueueTrigger2 was triggered by "${msg}"`);
        }
    });
});
