// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function eventHubOneTriggerAndOutput(message: unknown, context: InvocationContext): Promise<unknown> {
    context.log(`eventHubOneTriggerAndOutput was triggered by "${message}"`);
    return message;
}

app.eventHub('eventHubOneTriggerAndOutput', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubOneTriggerAndOutput',
    cardinality: 'one',
    return: output.eventHub({
        connection: 'e2eTest_eventHub',
        eventHubName: 'e2eTestHubOneTrigger',
    }),
    handler: eventHubOneTriggerAndOutput,
});
