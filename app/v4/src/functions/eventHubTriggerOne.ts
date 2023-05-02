// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubTriggerOne(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`eventHubTriggerOne was triggered by "${message}"`);
}

app.eventHub('eventHubTriggerOne', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2etesteventhubone',
    cardinality: 'one',
    handler: eventHubTriggerOne,
});
