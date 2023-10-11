// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function storageQueueTrigger(queueItem: string, context: InvocationContext): Promise<void> {
    context.log(`storageQueueTrigger was triggered by "${queueItem}"`);
}

app.storageQueue('storageQueueTrigger', {
    queueName: 'e2e-test-queue-trigger',
    connection: 'e2eTest_storage',
    handler: storageQueueTrigger,
});
