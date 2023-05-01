// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function storageQueueTrigger1(queueItem: string, context: InvocationContext): Promise<string> {
    context.log(`storageQueueTrigger1 was triggered by "${queueItem}"`);
    return queueItem;
}

app.storageQueue('storageQueueTrigger1', {
    queueName: 'e2etestqueue1',
    connection: 'e2eTest_storage',
    return: output.storageQueue({
        queueName: 'e2etestqueue2',
        connection: 'e2eTest_storage',
    }),
    handler: storageQueueTrigger1,
});
