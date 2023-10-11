// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function eventHubManyTrigger(messages: unknown[], context: InvocationContext): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (typeof message === 'string') {
            context.log(`eventHubManyTrigger was triggered by string body "${message}"`);
        } else {
            context.log(`eventHubManyTrigger was triggered by object body "${JSON.stringify(message)}"`);
        }
        context.log(
            `eventHubManyTrigger message properties: "${JSON.stringify(context.triggerMetadata.propertiesArray[i])}"`
        );
    }
}

app.eventHub('eventHubManyTrigger', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubManyTrigger',
    cardinality: 'many',
    handler: eventHubManyTrigger,
});
