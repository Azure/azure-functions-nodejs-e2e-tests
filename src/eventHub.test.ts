// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubProducerClient } from '@azure/event-hubs';
import { isOldConfig, waitForOutput } from './global.test';
import { eventHubConnectionString } from './utils/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';
import { EventHub } from './constants';

describe('eventHub', () => {
    let clientOneTriggerAndOutput: EventHubProducerClient;
    let clientOneTrigger: EventHubProducerClient;
    let clientManyTriggerAndOutput: EventHubProducerClient;
    let clientManyTrigger: EventHubProducerClient;


    before(function (this: Mocha.Context) {
        // Old config (Exts bundles < 4.0.0) cannot use EventHub emulator
        // Microsoft.Azure.Functions.Worker.Extensions.EventHubs bundle must be >= 6.3.0
        // https://github.com/Azure/azure-event-hubs-emulator-installer/issues/15
        if (isOldConfig) {
            this.skip();
        }
        clientOneTriggerAndOutput = new EventHubProducerClient(eventHubConnectionString, EventHub.eventHubOneTriggerAndOutput);
        clientOneTrigger = new EventHubProducerClient(eventHubConnectionString, EventHub.eventHubOneTrigger);
        clientManyTriggerAndOutput = new EventHubProducerClient(eventHubConnectionString, EventHub.eventHubManyTriggerAndOutput);
        clientManyTrigger = new EventHubProducerClient(eventHubConnectionString, EventHub.eventHubManyTrigger);
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
                },
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
