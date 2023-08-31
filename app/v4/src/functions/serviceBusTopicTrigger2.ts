// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusTopicTrigger2(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`serviceBusTopicTrigger2 was triggered by "${message}"`);
}

app.serviceBusTopic('serviceBusTopicTrigger2', {
    connection: 'e2eTest_serviceBus',
    topicName: 'e2etesttopic2',
    subscriptionName: 'e2etestsub',
    handler: serviceBusTopicTrigger2,
});
