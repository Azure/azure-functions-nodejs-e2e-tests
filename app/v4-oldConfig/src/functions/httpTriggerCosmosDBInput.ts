// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const cosmosInput = input.cosmosDB({
    databaseName: 'e2eTestDB',
    collectionName: 'e2eTestContainerTriggerAndOutput',
    id: '{Query.id}',
    partitionKey: 'testPartKey',
    connectionStringSetting: 'e2eTest_cosmosDB',
});

export async function httpTriggerCosmosDBInput(
    _request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const doc = context.extraInputs.get(cosmosInput);
    return { body: (<any>doc).testData };
}

app.http('httpTriggerCosmosDBInput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    handler: httpTriggerCosmosDBInput,
});
