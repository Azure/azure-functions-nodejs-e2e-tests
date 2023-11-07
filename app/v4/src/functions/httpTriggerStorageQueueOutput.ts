// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const storageOutput = output.storageQueue({
    queueName: 'e2e-test-queue-trigger',
    connection: 'e2eTest_storage',
});

export async function httpTriggerStorageQueueOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const body = <{ output: any }>await request.json();
    context.extraOutputs.set(storageOutput, body.output);
    return { body: 'done' };
}

app.http('httpTriggerStorageQueueOutput', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [storageOutput],
    handler: httpTriggerStorageQueueOutput,
});
