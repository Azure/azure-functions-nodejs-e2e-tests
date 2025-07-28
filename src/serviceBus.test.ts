// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ServiceBusClient } from '@azure/service-bus';
import { default as fetch } from 'node-fetch';
import { getFuncUrl } from './constants';
import { waitForOutput } from './global.test';
import { getRandomTestData } from './utils/getRandomTestData';
import { serviceBusConnectionString } from './utils/connectionStrings';
import { ServiceBus } from './constants';

describe('serviceBus', () => {
    let client: ServiceBusClient;

    before(() => {
        client = new ServiceBusClient(serviceBusConnectionString);
    });

    after(async () => {
        void client.close();
    });

    it('queue trigger and output', async () => {
        const message = getRandomTestData();
        const sender = client.createSender(ServiceBus.serviceBusQueueOneTriggerAndOutput);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusQueueTriggerAndOutput was triggered by "${message}"`);
        await waitForOutput(`serviceBusQueueTrigger was triggered by "${message}"`);
    });

    it('topic trigger and output', async () => {
        const message = getRandomTestData();
        const sender = client.createSender(ServiceBus.serviceBusTopicTriggerAndOutput);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusTopicTriggerAndOutput was triggered by "${message}"`);
        await waitForOutput(`serviceBusTopicTrigger was triggered by "${message}"`);
    });

    it('trigger and output, cardinality many', async () => {
        const message1 = getRandomTestData();
        const message2 = getRandomTestData();
        const sender = client.createSender(ServiceBus.serviceBusQueueManyTriggerAndOutput);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message1 });
        batch.tryAddMessage({ body: message2 });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusQueueManyTriggerAndOutput was triggered by "${message1}"`);
        await waitForOutput(`serviceBusQueueManyTriggerAndOutput was triggered by "${message2}"`);
        await waitForOutput(`serviceBusQueueManyTrigger was triggered by "${message1}"`);
        await waitForOutput(`serviceBusQueueManyTrigger was triggered by "${message2}"`);
    });

    it('extra output', async () => {
        const url = getFuncUrl('httpTriggerServiceBusOutput');

        // single
        const message = getRandomTestData();
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: message }) });
        await waitForOutput(`serviceBusQueueTrigger was triggered by "${message}"`);

        // bulk
        const bulkMsgs: string[] = [];
        for (let i = 0; i < 5; i++) {
            bulkMsgs.push(getRandomTestData());
        }
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: bulkMsgs }) });
        for (const msg of bulkMsgs) {
            await waitForOutput(`serviceBusQueueTrigger was triggered by "${msg}"`);
        }
    });
});