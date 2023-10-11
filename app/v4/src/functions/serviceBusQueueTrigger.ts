// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusQueueTrigger(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`serviceBusQueueTrigger was triggered by "${message}"`);
}

app.serviceBusQueue('serviceBusQueueTrigger', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2eTestQueueOneTrigger',
    handler: serviceBusQueueTrigger,
});
