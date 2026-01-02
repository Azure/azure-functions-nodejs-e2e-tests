// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { createRandomStream } from '../utils/streamHttp';

export async function httpTriggerSendStream(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const lengthInMb = request.query.get('lengthInMb');
    const stream = createRandomStream(Number(lengthInMb));
    return { body: stream as any };
}

app.http('httpTriggerSendStream', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTriggerSendStream,
});
