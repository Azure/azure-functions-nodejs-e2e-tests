// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const cosmosDBMongoInput = input.cosmosDBMongo({
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestCosmosDBMongo',
    collectionName: 'e2eTestCollectionTriggerAndOutput',
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
    return { body: document ? (<any>document).testData : '' };
}

app.http('httpTriggerCosmosDBMongoInput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [cosmosDBMongoInput],
    handler: httpTriggerCosmosDBMongoInput,
});
