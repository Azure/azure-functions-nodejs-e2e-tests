// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ContainerClient } from '@azure/storage-blob';
import { QueueClient } from '@azure/storage-queue';
import { default as fetch } from 'node-fetch';
import { getFuncUrl } from './constants';
import { waitForOutput } from './global.test';
import { storageConnectionString } from './resources/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';

describe('storage', () => {
    it('queue trigger and output', async () => {
        const client = new QueueClient(storageConnectionString, 'e2etestqueue1');
        await client.createIfNotExists();

        const message = getRandomTestData();
        await client.sendMessage(Buffer.from(message).toString('base64'));

        await waitForOutput(`storageQueueTrigger1 was triggered by "${message}"`);
        await waitForOutput(`storageQueueTrigger2 was triggered by "${message}"`);
    });

    it('queue extra output', async () => {
        const url = getFuncUrl('storageQueueOutput1');

        // single
        const message = getRandomTestData();
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: message }) });
        await waitForOutput(`storageQueueTrigger2 was triggered by "${message}"`);

        // bulk
        const bulkMsgs: string[] = [];
        for (let i = 0; i < 5; i++) {
            bulkMsgs.push(getRandomTestData());
        }
        await fetch(url, { method: 'POST', body: JSON.stringify({ output: bulkMsgs }) });
        for (const msg of bulkMsgs) {
            await waitForOutput(`storageQueueTrigger2 was triggered by "${msg}"`);
        }
    });

    it('blob trigger and output', async () => {
        const containerName = 'e2etestcontainer';
        const client = new ContainerClient(storageConnectionString, containerName);
        await client.createIfNotExists();

        const message = getRandomTestData();
        const messageBuffer = Buffer.from(message);
        const blobName = 'e2etestblob1';
        await client.uploadBlockBlob(blobName, messageBuffer, messageBuffer.byteLength);

        await waitForOutput(
            `storageBlobTrigger1 was triggered by blob "${containerName}/${blobName}" with content "${message}"`
        );
        await waitForOutput(
            `storageBlobTrigger2 was triggered by blob "${containerName}/e2etestblob2" with content "${message}"`
        );
    });
});
