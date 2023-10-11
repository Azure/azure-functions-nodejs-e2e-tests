// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function storageQueueTriggerAndOutput(queueItem: string, context: InvocationContext): Promise<string> {
    context.log(`storageQueueTriggerAndOutput was triggered by "${queueItem}"`);
    return queueItem;
}

app.storageQueue('storageQueueTriggerAndOutput', {
    queueName: 'e2e-test-queue-trigger-and-output',
    connection: 'e2eTest_storage',
    return: output.storageQueue({
        queueName: 'e2e-test-queue-trigger',
        connection: 'e2eTest_storage',
    }),
    handler: storageQueueTriggerAndOutput,
});
