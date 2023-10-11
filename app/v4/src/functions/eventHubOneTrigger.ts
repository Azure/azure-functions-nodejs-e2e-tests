// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubOneTrigger(message: unknown, context: InvocationContext): Promise<void> {
    if (typeof message === 'string') {
        context.log(`eventHubOneTrigger was triggered by string body "${message}"`);
    } else {
        context.log(`eventHubOneTrigger was triggered by object body "${JSON.stringify(message)}"`);
    }
    context.log(`eventHubOneTrigger message properties: "${JSON.stringify(context.triggerMetadata.properties)}"`);
}

app.eventHub('eventHubOneTrigger', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubOneTrigger',
    cardinality: 'one',
    handler: eventHubOneTrigger,
});
