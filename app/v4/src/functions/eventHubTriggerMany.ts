// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubTriggerMany(messages: unknown[], _context: InvocationContext): Promise<void> {
    console.log(`eventHubTriggerMany processed ${messages.length} messages`);
    for (const message of messages) {
        console.log(`eventHubTriggerMany was triggered by "${message}"`);
    }
}

app.eventHub('eventHubTriggerMany', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2etesteventhubmany',
    cardinality: 'many',
    handler: eventHubTriggerMany,
});
