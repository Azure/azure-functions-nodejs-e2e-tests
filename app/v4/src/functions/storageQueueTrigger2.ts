// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function storageQueueTrigger2(queueItem: string, _context: InvocationContext): Promise<void> {
    console.log(`storageQueueTrigger2 was triggered by "${queueItem}"`);
}

app.storageQueue('storageQueueTrigger2', {
    queueName: 'e2etestqueue2',
    connection: 'e2eTest_storage',
    handler: storageQueueTrigger2,
});
