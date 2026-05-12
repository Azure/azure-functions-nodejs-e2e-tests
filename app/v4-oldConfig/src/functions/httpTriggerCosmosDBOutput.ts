// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, output } from '@azure/functions';
import { getRequiredJsonBody, hasRequiredStringFields, validateObjectOrArray } from '../utils/httpValidation';

const cosmosOutput = output.cosmosDB({
    databaseName: 'e2eTestCosmosDB',
    collectionName: 'e2eTestContainerTrigger',
    connectionStringSetting: 'CosmosDBConnection',
});

export async function httpTriggerCosmosDBOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const bodyResult = await getRequiredJsonBody(request);
    if ('response' in bodyResult) {
        return bodyResult.response;
    }

    const validationError = validateObjectOrArray(
        bodyResult.value,
        (item) => hasRequiredStringFields(item, ['id', 'testData']),
        'Request body must include Cosmos DB documents with non-empty "id" and "testData" values.'
    );
    if (validationError) {
        return validationError;
    }

    context.extraOutputs.set(cosmosOutput, bodyResult.value);
    return { body: 'done' };
}

app.http('httpTriggerCosmosDBOutput', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosOutput],
    handler: httpTriggerCosmosDBOutput,
});
