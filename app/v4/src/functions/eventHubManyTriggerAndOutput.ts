// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function eventHubManyTriggerAndOutput(
    messages: unknown[],
    context: InvocationContext
): Promise<unknown[]> {
    for (const message of messages) {
        context.log(`eventHubManyTriggerAndOutput was triggered by "${message}"`);
    }

    // do an extra stringify to make sure the values are JSON-parse-able otherwise it'll hit this bug:
    // https://github.com/Azure/azure-functions-eventhubs-extension/issues/118
    return messages.map((m) => JSON.stringify(m));
}

app.eventHub('eventHubManyTriggerAndOutput', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubManyTriggerAndOutput',
    cardinality: 'many',
    return: output.eventHub({
        connection: 'e2eTest_eventHub',
        eventHubName: 'e2eTestHubManyTrigger',
    }),
    handler: eventHubManyTriggerAndOutput,
});
