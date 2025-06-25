// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { waitForOutput } from './global.test';
import { eventHubConnectionString } from './utils/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';

describe('eventHub', () => {
    let clientOneTriggerAndOutput: EventHubProducerClient;
    let clientOneTrigger: EventHubProducerClient;
    let clientManyTriggerAndOutput: EventHubProducerClient;
    let clientManyTrigger: EventHubProducerClient;


    before(() => {
        clientOneTriggerAndOutput = new EventHubProducerClient(eventHubConnectionString, "e2e-test-hub-one-trigger-and-output");
        clientOneTrigger = new EventHubProducerClient(eventHubConnectionString, "e2e-test-hub-one-trigger");
        clientManyTriggerAndOutput = new EventHubProducerClient(eventHubConnectionString, "e2e-test-hub-many-trigger-and-output");
        clientManyTrigger = new EventHubProducerClient(eventHubConnectionString, "e2e-test-hub-many-trigger");
    });

    after(async () => {
        void clientOneTriggerAndOutput.close();
        void clientOneTrigger.close();
        void clientManyTriggerAndOutput.close();
        void clientManyTrigger.close();
    });

    describe('cardinality one', () => {
        it('trigger and output', async () => {
            const message = getRandomTestData();
            await clientOneTriggerAndOutput.sendBatch([{ body: message }]);

            await waitForOutput(`eventHubOneTriggerAndOutput was triggered by string body "${message}"`);
            await waitForOutput(`eventHubOneTrigger was triggered by string body "${message}"`);
        });

        it('object message with properties', async () => {
            const messageBody = { data: getRandomTestData() };
            const messageProperties = { prop1: getRandomTestData() };
            await clientOneTrigger.sendBatch([
                {
                    body: messageBody,
                    properties: messageProperties,
                }
            ]);

            await waitForOutput(`eventHubOneTrigger was triggered by object body "${JSON.stringify(messageBody)}"`);
            await waitForOutput(`eventHubOneTrigger message properties: "${JSON.stringify(messageProperties)}"`);
        });
    });

    describe('cardinality many', () => {
        it('trigger and output', async () => {
            const message = getRandomTestData();
            const message2 = getRandomTestData();
            await clientManyTriggerAndOutput.sendBatch([{ body: message }, { body: message2 }]);

            await waitForOutput(`eventHubManyTriggerAndOutput was triggered by string body "${message}"`);
            await waitForOutput(`eventHubManyTriggerAndOutput was triggered by string body "${message2}"`);
            await waitForOutput(`eventHubManyTrigger was triggered by string body "${message}"`);
            await waitForOutput(`eventHubManyTrigger was triggered by string body "${message2}"`);
        });

        it('object message with properties', async () => {
            const messageBody1 = { data: getRandomTestData() };
            const messageProperties1 = { prop1: getRandomTestData() };
            const messageBody2 = { data: getRandomTestData() };
            const messageProperties2 = { prop1: getRandomTestData() };
            await clientManyTrigger.sendBatch([
                {
                    body: messageBody1,
                    properties: messageProperties1,
                },
                {
                    body: messageBody2,
                    properties: messageProperties2,
                },
            ]);

            await waitForOutput(`eventHubManyTrigger was triggered by object body "${JSON.stringify(messageBody1)}"`);
            await waitForOutput(`eventHubManyTrigger message properties: "${JSON.stringify(messageProperties1)}"`);
            await waitForOutput(`eventHubManyTrigger was triggered by object body "${JSON.stringify(messageBody2)}"`);
            await waitForOutput(`eventHubManyTrigger message properties: "${JSON.stringify(messageProperties2)}"`);
        });
    });
});
