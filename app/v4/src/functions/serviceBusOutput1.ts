// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, output } from '@azure/functions';

const serviceBusOutput = output.serviceBusQueue({
    connection: 'e2eTest_serviceBus',
    queueName: 'e2etestqueue2',
});

export async function serviceBusOutput1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = <{ output: any }>await request.json();
    context.extraOutputs.set(serviceBusOutput, body.output);
    return { body: 'done' };
}

app.http('serviceBusOutput1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [serviceBusOutput],
    handler: serviceBusOutput1,
});
