// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function serviceBusQueueManyTriggerAndOutput(
    messages: unknown[],
    context: InvocationContext
): Promise<unknown> {
    for (const message of messages) {
        context.log(`serviceBusQueueManyTriggerAndOutput was triggered by "${message}"`);
    }

    // do an extra stringify to make sure the values are JSON-parse-able otherwise it'll hit this bug:
    // https://github.com/Azure/azure-functions-eventhubs-extension/issues/118
    return messages.map((m) => JSON.stringify(m));
}

app.serviceBusQueue('serviceBusQueueManyTriggerAndOutput', {
    connection: 'ServiceBusConnection',
    queueName: 'e2e-test-queue-many-trigger-and-output',
    cardinality: 'many',
    return: output.serviceBusQueue({
        connection: 'ServiceBusConnection',
        queueName: 'e2e-test-queue-many-trigger',
    }),
    handler: serviceBusQueueManyTriggerAndOutput,
});
