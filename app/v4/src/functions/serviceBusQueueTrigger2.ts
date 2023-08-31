// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusQueueTrigger2(message: unknown, context: InvocationContext): Promise<void> {
    context.log(`serviceBusQueueTrigger2 was triggered by "${message}"`);
}

app.serviceBusQueue('serviceBusQueueTrigger2', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2etestqueue2',
    handler: serviceBusQueueTrigger2,
});
