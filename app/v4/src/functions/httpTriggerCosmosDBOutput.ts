// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const cosmosOutput = output.cosmosDB({
    databaseName: 'e2eTestDB',
    containerName: 'e2eTestContainerTrigger',
    connection: 'CosmosDBConnection',
});

export async function httpTriggerCosmosDBOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const body = await request.json();
    context.extraOutputs.set(cosmosOutput, body);
    return { body: 'done' };
}

app.http('httpTriggerCosmosDBOutput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [cosmosOutput],
    handler: httpTriggerCosmosDBOutput,
});
