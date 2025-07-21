// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext, output } from '@azure/functions';

// export async function storageBlobTriggerAndOutput(blob: Buffer, context: InvocationContext): Promise<Buffer> {
//     const blobPath = context.triggerMetadata.blobTrigger;
//     context.log(`storageBlobTriggerAndOutput was triggered by blob "${blobPath}" with content "${blob.toString()}"`);
//     return blob;
// }

// app.storageBlob('storageBlobTriggerAndOutput', {
//     path: 'e2e-test-container/e2e-test-blob-trigger-and-output',
//     connection: 'AzureWebJobsStorage',
//     return: output.storageBlob({
//         path: 'e2e-test-container/e2e-test-blob-trigger',
//         connection: 'AzureWebJobsStorage',
//     }),
//     handler: storageBlobTriggerAndOutput,
// });
