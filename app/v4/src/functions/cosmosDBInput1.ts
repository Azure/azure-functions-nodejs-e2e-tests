// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const cosmosInput = input.cosmosDB({
    databaseName: 'e2eTestDB',
    containerName: 'e2eTestContainer1',
    id: '{Query.id}',
    partitionKey: 'testPartKey',
    connection: 'e2eTest_cosmosDB',
});

export async function cosmosDBInput1(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const doc = context.extraInputs.get(cosmosInput);
    return { body: (<any>doc).testData };
}

app.http('cosmosDBInput1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    handler: cosmosDBInput1,
});
