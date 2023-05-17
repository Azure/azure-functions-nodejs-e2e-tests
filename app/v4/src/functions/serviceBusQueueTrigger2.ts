// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function serviceBusQueueTrigger2(message: unknown, _context: InvocationContext): Promise<void> {
    console.log(`serviceBusQueueTrigger2 was triggered by "${message}"`);
}

app.serviceBusQueue('serviceBusQueueTrigger2', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2etestqueue2',
    handler: serviceBusQueueTrigger2,
});
