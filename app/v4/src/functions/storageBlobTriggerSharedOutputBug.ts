// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext, output } from '@azure/functions';

// // Test for bug https://github.com/Azure/azure-functions-nodejs-library/issues/179

// const queueOutput = output.storageQueue({
//     queueName: 'e2e-test-queue-trigger',
//     connection: 'e2eTest_storage',
// });

// app.storageBlob('storageBlobTriggerReturnOutput', {
//     path: 'e2e-test-container/e2e-test-blob-trigger-shared-output-bug',
//     connection: 'e2eTest_storage',
//     return: queueOutput,
//     handler: (blob: Buffer, context: InvocationContext) => {
//         context.log(`storageBlobTriggerReturnOutput was triggered`);
//         return `${blob.toString()}-returnOutput`;
//     },
// });

// app.storageBlob('storageBlobTriggerExtraOutput', {
//     path: 'e2e-test-container/e2e-test-blob-trigger-shared-output-bug',
//     connection: 'e2eTest_storage',
//     extraOutputs: [queueOutput],
//     handler: (blob: Buffer, context: InvocationContext) => {
//         context.log(`storageBlobTriggerExtraOutput was triggered`);
//         context.extraOutputs.set(queueOutput, `${blob.toString()}-extraOutput`);
//     },
// });
