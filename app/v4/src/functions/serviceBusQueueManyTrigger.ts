// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusQueueManyTrigger(messages: unknown[], context: InvocationContext): Promise<void> {
    for (const message of messages) {
        context.log(`serviceBusQueueManyTrigger was triggered by "${message}"`);
    }
}

app.serviceBusQueue('serviceBusQueueManyTrigger', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2eTestQueueManyTrigger',
    cardinality: 'many',
    handler: serviceBusQueueManyTrigger,
});
