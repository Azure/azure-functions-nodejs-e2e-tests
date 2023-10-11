// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubOneTrigger(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`eventHubOneTrigger was triggered by "${message}"`);
}

app.eventHub('eventHubOneTrigger', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubOneTrigger',
    cardinality: 'one',
    handler: eventHubOneTrigger,
});
