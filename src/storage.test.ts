// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ContainerClient } from '@azure/storage-blob';
import { QueueClient } from '@azure/storage-queue';
import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { getFuncUrl } from './constants';
import { model, waitForOutput } from './global.test';
import { storageConnectionString } from './resources/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';

describe('storage', () => {
    it('queue trigger and output', async () => {
        const client = new QueueClient(storageConnectionString, 'e2e-test-queue-trigger-and-output');
        await client.createIfNotExists();

        const message = getRandomTestData();
        await client.sendMessage(Buffer.from(message).toString('base64'));

        await waitForOutput(`storageQueueTriggerAndOutput was triggered by "${message}"`);
        await waitForOutput(`storageQueueTrigger was triggered by "${message}"`);
    });

    it('queue extra output', async () => {
        const url = getFuncUrl('httpTriggerStorageQueueOutput');

        // single
        const message = getRandomTestData();
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: message }) });
        await waitForOutput(`storageQueueTrigger was triggered by "${message}"`);

        // bulk
        const bulkMsgs: string[] = [];
        for (let i = 0; i < 5; i++) {
            bulkMsgs.push(getRandomTestData());
        }
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: bulkMsgs }) });
        for (const msg of bulkMsgs) {
            await waitForOutput(`storageQueueTrigger was triggered by "${msg}"`);
        }
    });

    it('blob trigger and output', async () => {
        const containerName = 'e2e-test-container';
        const client = new ContainerClient(storageConnectionString, containerName);
        await client.createIfNotExists();

        const message = getRandomTestData();
        const messageBuffer = Buffer.from(message);
        const blobName = 'e2e-test-blob-trigger-and-output';
        await client.uploadBlockBlob(blobName, messageBuffer, messageBuffer.byteLength);

        await waitForOutput(
            `storageBlobTriggerAndOutput was triggered by blob "${containerName}/${blobName}" with content "${message}"`
        );
        await waitForOutput(
            `storageBlobTrigger was triggered by blob "${containerName}/e2e-test-blob-trigger" with content "${message}"`
        );
    });

    type TableItem = { PartitionKey: string; RowKey: string; Name: string };

    it('table input and output', async () => {
        const rowKey = getRandomTestData();
        const items: TableItem[] = [
            {
                PartitionKey: 'e2eTestPartKey',
                RowKey: rowKey,
                Name: 'e2eTestName',
            },
        ];
        const responseOut = await fetch(getFuncUrl('httpTriggerTableOutput'), {
            method: 'POST',
            body: JSON.stringify(items),
        });
        expect(responseOut.status).to.equal(201);
        await waitForOutput(`httpTriggerTableOutput was triggered`);

        const responseIn = await fetch(getFuncUrl(`httpTriggerTableInput/${rowKey}`), { method: 'GET' });
        expect(responseIn.status).to.equal(200);
        const result = await responseIn.json();
        expect(result).to.deep.equal(items);
        await waitForOutput(`httpTriggerTableInput was triggered`);
    });

    // Test for bug https://github.com/Azure/azure-functions-nodejs-library/issues/179
    it('Shared output bug', async function (this: Mocha.Context) {
        if (model === 'v3') {
            this.skip();
        }

        const containerName = 'e2e-test-container';
        const client = new ContainerClient(storageConnectionString, containerName);
        await client.createIfNotExists();

        const message = getRandomTestData();
        const messageBuffer = Buffer.from(message);
        const blobName = 'e2e-test-blob-trigger-shared-output-bug';
        await client.uploadBlockBlob(blobName, messageBuffer, messageBuffer.byteLength);

        await waitForOutput(`storageBlobTriggerReturnOutput was triggered`);
        await waitForOutput(`storageBlobTriggerExtraOutput was triggered`);
        await waitForOutput(`storageQueueTrigger was triggered by "${message}-returnOutput"`);
        await waitForOutput(`storageQueueTrigger was triggered by "${message}-extraOutput"`);
    });
});
