// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function storageBlobTrigger2(blob: Buffer, context: InvocationContext): Promise<void> {
    const blobPath = context.triggerMetadata.blobTrigger;
    context.log(`storageBlobTrigger2 was triggered by blob "${blobPath}" with content "${blob.toString()}"`);
}

app.storageBlob('storageBlobTrigger2', {
    path: 'e2etestcontainer/e2etestblob2',
    connection: 'e2eTest_storage',
    handler: storageBlobTrigger2,
});
