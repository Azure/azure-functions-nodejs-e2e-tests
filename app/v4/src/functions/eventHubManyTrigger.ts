// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubManyTrigger(messages: unknown[], context: InvocationContext): Promise<void> {
    for (const message of messages) {
        context.log(`eventHubManyTrigger was triggered by "${message}"`);
    }
}

app.eventHub('eventHubManyTrigger', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubManyTrigger',
    cardinality: 'many',
    handler: eventHubManyTrigger,
});
