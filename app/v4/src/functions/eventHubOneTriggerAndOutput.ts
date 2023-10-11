// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function eventHubOneTriggerAndOutput(message: unknown, context: InvocationContext): Promise<unknown> {
    if (typeof message === 'string') {
        context.log(`eventHubOneTriggerAndOutput was triggered by string body "${message}"`);
    } else {
        context.log(`eventHubOneTriggerAndOutput was triggered by object body "${JSON.stringify(message)}"`);
    }
    context.log(
        `eventHubOneTriggerAndOutput message properties: "${JSON.stringify(context.triggerMetadata.properties)}"`
    );
    return message;
}

app.eventHub('eventHubOneTriggerAndOutput', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2eTestHubOneTriggerAndOutput',
    cardinality: 'one',
    return: output.eventHub({
        connection: 'e2eTest_eventHub',
        eventHubName: 'e2eTestHubOneTrigger',
    }),
    handler: eventHubOneTriggerAndOutput,
});
