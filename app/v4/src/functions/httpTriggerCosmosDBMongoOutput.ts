// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const cosmosDBMongoOutput = output.cosmosDBMongo({
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestCosmosDBMongo',
    collectionName: 'e2eTestCollectionTrigger',
    createIfNotExists: true,
});

export async function httpTriggerCosmosDBMongoOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const body = await request.json();
    context.extraOutputs.set(cosmosDBMongoOutput, body);
    return { body: 'done' };
}

app.http('httpTriggerCosmosDBMongoOutput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [cosmosDBMongoOutput],
    handler: httpTriggerCosmosDBMongoOutput,
});
