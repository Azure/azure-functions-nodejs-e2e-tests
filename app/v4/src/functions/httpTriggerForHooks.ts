// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function httpTriggerForHooks(
    request: HttpRequest,
    extraInput: string,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`httpTriggerForHooks was triggered with second input ${extraInput}`);
    return { body: 'hookBodyResponse' };
}

app.http('httpTriggerForHooks', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: <any>httpTriggerForHooks,
});
