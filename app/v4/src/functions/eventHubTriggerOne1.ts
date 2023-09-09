// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function eventHubTriggerOne1(message: unknown, context: InvocationContext): Promise<unknown> {
    context.log(`eventHubTriggerOne1 was triggered by "${message}"`);
    return message;
}

app.eventHub('eventHubTriggerOne1', {
    connection: 'e2eTest_eventHub',
    eventHubName: 'e2etesteventhubone1',
    cardinality: 'one',
    return: output.eventHub({
        connection: 'e2eTest_eventHub',
        eventHubName: 'e2etesteventhubone2',
    }),
    handler: eventHubTriggerOne1,
});
