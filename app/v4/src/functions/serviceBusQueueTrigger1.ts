// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function serviceBusQueueTrigger1(message: unknown, _context: InvocationContext): Promise<unknown> {
    console.log(`serviceBusQueueTrigger1 was triggered by "${message}"`);
    return message;
}

app.serviceBusQueue('serviceBusQueueTrigger1', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2etestqueue1',
    return: output.serviceBusQueue({
        connection: 'e2eTest_serviceBus',
        queueName: 'e2etestqueue2',
    }),
    handler: serviceBusQueueTrigger1,
});
