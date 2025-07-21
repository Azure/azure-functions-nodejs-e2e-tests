// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext, output } from '@azure/functions';

// export async function serviceBusQueueTriggerAndOutput(message: unknown, context: InvocationContext): Promise<unknown> {
//     context.log(`serviceBusQueueTriggerAndOutput was triggered by "${message}"`);
//     return message;
// }

// app.serviceBusQueue('serviceBusQueueTriggerAndOutput', {
//     connection: 'EventHubConnection',
//     queueName: 'e2e-test-queue-one-trigger-and-output',
//     return: output.serviceBusQueue({
//         connection: 'EventHubConnection',
//         queueName: 'e2e_test_queue_one_trigger',
//     }),
//     handler: serviceBusQueueTriggerAndOutput,
// });
