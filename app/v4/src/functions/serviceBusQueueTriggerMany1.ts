// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function serviceBusQueueTriggerMany1(messages: unknown[], context: InvocationContext): Promise<unknown> {
    for (const message of messages) {
        context.log(`serviceBusQueueTriggerMany1 was triggered by "${message}"`);
    }

    // do an extra stringify to make sure the values are JSON-parse-able otherwise it'll hit this bug:
    // https://github.com/Azure/azure-functions-eventhubs-extension/issues/118
    return messages.map((m) => JSON.stringify(m));
}

app.serviceBusQueue('serviceBusQueueTriggerMany1', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2etestqueuemany1',
    cardinality: 'many',
    return: output.serviceBusQueue({
        connection: 'e2eTest_serviceBus',
        queueName: 'e2etestqueuemany2',
    }),
    handler: serviceBusQueueTriggerMany1,
});
