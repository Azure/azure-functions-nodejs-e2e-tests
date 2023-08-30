// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ContainerClient } from '@azure/storage-blob';
import { QueueClient } from '@azure/storage-queue';
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
