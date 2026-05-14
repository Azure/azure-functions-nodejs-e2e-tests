// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const cosmosDBMongoInput = (input as any).cosmosDBMongo({
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestMongoDB',
    collectionName: 'e2eTestMongoCollection',
    queryString: '{{"_id":"{Query.id}"}}',
    createIfNotExists: true,
});

export async function httpTriggerCosmosDBMongoInput(
    _request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const result = context.extraInputs.get(cosmosDBMongoInput);
    const documents = typeof result === 'string' ? JSON.parse(result) : result;
    const document = Array.isArray(documents) ? documents[0] : documents;
    return { jsonBody: document ?? null };
}

app.http('httpTriggerCosmosDBMongoInput', {
    methods: ['GET'],
    authLevel: 'anonymous',
    extraInputs: [cosmosDBMongoInput],
    handler: httpTriggerCosmosDBMongoInput,
});

