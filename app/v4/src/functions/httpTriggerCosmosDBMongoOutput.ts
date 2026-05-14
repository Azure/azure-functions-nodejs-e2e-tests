// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const cosmosDBMongoOutput = (output as any).cosmosDBMongo({
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestMongoDB',
    collectionName: 'e2eTestMongoCollection',
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
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [cosmosDBMongoOutput],
    handler: httpTriggerCosmosDBMongoOutput,
});
