// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubTriggerMany2(messages: unknown[], context: InvocationContext): Promise<void> {
    for (const message of messages) {
        context.log(`eventHubTriggerMany2 was triggered by "${message}"`);
    }
}

app.eventHub('eventHubTriggerMany2', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2etesteventhubmany2',
    cardinality: 'many',
    handler: eventHubTriggerMany2,
});
