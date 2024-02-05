// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { addRandomAsyncOrSyncDelay } from '../utils/getRandomTestData';

export async function httpTriggerRandomDelay(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    await addRandomAsyncOrSyncDelay();

    const name = request.query.get('name') || (await request.text()) || 'world';

    return { body: `Hello, ${name}!` };
}

app.http('httpTriggerRandomDelay', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTriggerRandomDelay,
});
