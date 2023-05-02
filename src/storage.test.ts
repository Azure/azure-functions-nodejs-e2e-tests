// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ContainerClient } from '@azure/storage-blob';
import { QueueClient } from '@azure/storage-queue';
import { waitForOutput } from './global.test';
import { getRandomHexString } from './utils/getRandomHexString';
import { nonNullProp } from './utils/nonNull';

describe('storage', () => {
    const connectionString = nonNullProp(process.env, 'e2eTest_storage');

    it('queue trigger and output', async () => {
        const client = new QueueClient(connectionString, 'e2etestqueue1');
        await client.createIfNotExists();

        const message = getRandomHexString();
        await client.sendMessage(Buffer.from(message).toString('base64'));

        await waitForOutput(`storageQueueTrigger1 was triggered by "${message}"`);
        await waitForOutput(`storageQueueTrigger2 was triggered by "${message}"`);
    });

    it('blob trigger and output', async () => {
        const client = new ContainerClient(connectionString, 'e2etestcontainer');
        await client.createIfNotExists();

        const message = getRandomHexString();
        const messageBuffer = Buffer.from(message);
        await client.uploadBlockBlob('e2etestblob1', messageBuffer, messageBuffer.byteLength);

        await waitForOutput(`storageBlobTrigger1 was triggered by "${message}"`);
        await waitForOutput(`storageBlobTrigger2 was triggered by "${message}"`);
    });
});
