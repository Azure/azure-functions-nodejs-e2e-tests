// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ServiceBusClient } from '@azure/service-bus';
import { waitForOutput } from './global.test';
import { serviceBusConnectionString } from './resources/connectionStrings';
import { serviceBusQueue1, serviceBusTopic1 } from './resources/serviceBus';
import { getRandomTestData } from './utils/getRandomTestData';

describe('serviceBus', () => {
    let client: ServiceBusClient;

    before(() => {
        client = new ServiceBusClient(serviceBusConnectionString);
    });

    after(async () => {
        await client.close();
    });

    it('queue', async () => {
        const message = getRandomTestData();
        const sender = client.createSender(serviceBusQueue1);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusQueueTrigger1 was triggered by "${message}"`);
        await waitForOutput(`serviceBusQueueTrigger2 was triggered by "${message}"`);
    });

    it('topic', async () => {
        const message = getRandomTestData();
        const sender = client.createSender(serviceBusTopic1);
        const batch = await sender.createMessageBatch();
        batch.tryAddMessage({ body: message });
        await sender.sendMessages(batch);

        await waitForOutput(`serviceBusTopicTrigger1 was triggered by "${message}"`);
        await waitForOutput(`serviceBusTopicTrigger2 was triggered by "${message}"`);
    });
});
