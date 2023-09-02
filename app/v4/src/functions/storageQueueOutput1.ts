// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, output } from '@azure/functions';

const storageOutput = output.storageQueue({
    queueName: 'e2etestqueue2',
    connection: 'e2eTest_storage',
});

export async function storageQueueOutput1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = <{ output: any }>await request.json();
    context.extraOutputs.set(storageOutput, body.output);
    return { body: 'done' };
}

app.http('storageQueueOutput1', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [storageOutput],
    handler: storageQueueOutput1,
});
