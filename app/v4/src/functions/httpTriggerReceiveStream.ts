// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { receiveStreamWithProgress } from '../utils/streamHttp';

export async function httpTriggerReceiveStream(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const bytesReceived = await receiveStreamWithProgress(request.body);

    return { body: `Bytes received: ${bytesReceived}` };
}

app.http('httpTriggerReceiveStream', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTriggerReceiveStream,
});
