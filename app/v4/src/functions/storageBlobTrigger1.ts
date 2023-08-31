// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function storageBlobTrigger1(blob: Buffer, context: InvocationContext): Promise<Buffer> {
    const blobPath = context.triggerMetadata.blobTrigger;
    console.log(`storageBlobTrigger1 was triggered by blob "${blobPath}" with content "${blob.toString()}"`);
    return blob;
}

app.storageBlob('storageBlobTrigger1', {
    path: 'e2etestcontainer/e2etestblob1',
    connection: 'e2eTest_storage',
    return: output.storageBlob({
        path: 'e2etestcontainer/e2etestblob2',
        connection: 'e2eTest_storage',
    }),
    handler: storageBlobTrigger1,
});
