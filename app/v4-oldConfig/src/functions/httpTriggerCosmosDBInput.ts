// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';
import { getRequiredQueryParam, isMissingResult, notFound } from '../utils/httpValidation';

const cosmosInput = input.cosmosDB({
    databaseName: 'e2eTestCosmosDB',
    collectionName: 'e2eTestContainerTriggerAndOutput',
    id: '{Query.id}',
    partitionKey: 'testPartKey',
    connectionStringSetting: 'CosmosDBConnection',
});

export async function httpTriggerCosmosDBInput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const idResult = getRequiredQueryParam(request, 'id');
    if ('response' in idResult) {
        return idResult.response;
    }

    const doc = context.extraInputs.get(cosmosInput);
    if (isMissingResult(doc)) {
        return notFound(`No Cosmos DB document was found for id \"${idResult.value}\".`);
    }

    return { body: (doc as { testData?: string }).testData };
}

app.http('httpTriggerCosmosDBInput', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [cosmosInput],
    handler: httpTriggerCosmosDBInput,
});
