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
    connection: 'EventHubConnection',
    eventHubName: 'e2e-test-hub-one-trigger-and-output',
    cardinality: 'one',
    consumerGroup: 'cg1',
    return: output.eventHub({
        connection: 'EventHubConnection',
        eventHubName: 'e2e-test-hub-one-trigger',
    }),
    handler: eventHubOneTriggerAndOutput,
});
