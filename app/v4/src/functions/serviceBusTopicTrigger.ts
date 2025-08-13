// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusTopicTrigger(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`serviceBusTopicTrigger was triggered by "${message}"`);
}

app.serviceBusTopic('serviceBusTopicTrigger', {
    connection: 'ServiceBusConnection',
    topicName: 'e2e-test-topic-trigger',
    subscriptionName: 'e2e-test-sub',
    handler: serviceBusTopicTrigger,
});
