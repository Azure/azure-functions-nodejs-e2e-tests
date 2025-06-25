// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext } from '@azure/functions';

// export async function serviceBusTopicTrigger(message: unknown, context: InvocationContext): Promise<void> {
//     context.log(`serviceBusTopicTrigger was triggered by "${message}"`);
// }

// app.serviceBusTopic('serviceBusTopicTrigger', {
//     connection: 'e2eTest_serviceBus',
//     topicName: 'e2eTestTopicTrigger',
//     subscriptionName: 'e2etestsub',
//     handler: serviceBusTopicTrigger,
// });
