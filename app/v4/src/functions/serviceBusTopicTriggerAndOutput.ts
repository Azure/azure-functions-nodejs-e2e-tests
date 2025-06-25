// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext, output } from '@azure/functions';

// export async function serviceBusTopicTriggerAndOutput(message: unknown, context: InvocationContext): Promise<unknown> {
//     context.log(`serviceBusTopicTriggerAndOutput was triggered by "${message}"`);
//     return message;
// }

// app.serviceBusTopic('serviceBusTopicTriggerAndOutput', {
//     connection: 'e2eTest_serviceBus',
//     topicName: 'e2eTestTopicTriggerAndOutput',
//     subscriptionName: 'e2etestsub',
//     return: output.serviceBusTopic({
//         connection: 'e2eTest_serviceBus',
//         topicName: 'e2eTestTopicTrigger',
//     }),
//     handler: serviceBusTopicTriggerAndOutput,
// });
