// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function serviceBusTopicTrigger1(message: unknown, context: InvocationContext): Promise<unknown> {
    context.log(`serviceBusTopicTrigger1 was triggered by "${message}"`);
    return message;
}

app.serviceBusTopic('serviceBusTopicTrigger1', {
    connection: 'e2eTest_serviceBus',
    topicName: 'e2etesttopic1',
    subscriptionName: 'e2etestsub',
    return: output.serviceBusTopic({
        connection: 'e2eTest_serviceBus',
        topicName: 'e2etesttopic2',
    }),
    handler: serviceBusTopicTrigger1,
});
