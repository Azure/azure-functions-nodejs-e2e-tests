// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext } from '@azure/functions';

// export async function storageBlobTrigger(blob: Buffer, context: InvocationContext): Promise<void> {
//     const blobPath = context.triggerMetadata.blobTrigger;
//     context.log(`storageBlobTrigger was triggered by blob "${blobPath}" with content "${blob.toString()}"`);
// }

// app.storageBlob('storageBlobTrigger', {
//     path: 'e2e-test-container/e2e-test-blob-trigger',
//     connection: 'e2eTest_storage',
//     handler: storageBlobTrigger,
// });
