// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function serviceBusQueueTriggerAndOutput(message: unknown, context: InvocationContext): Promise<unknown> {
    context.log(`serviceBusQueueTriggerAndOutput was triggered by "${message}"`);
    return message;
}

app.serviceBusQueue('serviceBusQueueTriggerAndOutput', {
    connection: 'e2eTest_serviceBus',
    queueName: 'e2eTestQueueOneTriggerAndOutput',
    return: output.serviceBusQueue({
        connection: 'e2eTest_serviceBus',
        queueName: 'e2eTestQueueOneTrigger',
    }),
    handler: serviceBusQueueTriggerAndOutput,
});
