// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusQueueTriggerMany2(messages: unknown[], context: InvocationContext): Promise<void> {
    for (const message of messages) {
        context.log(`serviceBusQueueTriggerMany2 was triggered by "${message}"`);
    }
}

app.serviceBusQueue('serviceBusQueueTriggerMany2', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2etestqueuemany2',
    cardinality: 'many',
    handler: serviceBusQueueTriggerMany2,
});
