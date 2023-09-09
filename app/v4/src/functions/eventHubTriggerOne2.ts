// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubTriggerOne2(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`eventHubTriggerOne2 was triggered by "${message}"`);
}

app.eventHub('eventHubTriggerOne2', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2etesteventhubone2',
    cardinality: 'one',
    handler: eventHubTriggerOne2,
});
