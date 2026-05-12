// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';
import { getRequiredJsonBody, hasRequiredStringFields, validateObjectOrArray } from '../utils/httpValidation';

const tableOutput = output.table({
    tableName: 'e2etesttable',
    connection: 'AzureWebJobsStorage',
});

export async function httpTriggerTableOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`httpTriggerTableOutput was triggered`);

    const bodyResult = await getRequiredJsonBody(request);
    if ('response' in bodyResult) {
        return bodyResult.response;
    }

    const validationError = validateObjectOrArray(
        bodyResult.value,
        (item) => hasRequiredStringFields(item, ['PartitionKey', 'RowKey']),
        'Request body must include table entities with non-empty "PartitionKey" and "RowKey" values.'
    );
    if (validationError) {
        return validationError;
    }

    context.extraOutputs.set(tableOutput, bodyResult.value);
    return { status: 201 };
}

app.http('httpTriggerTableOutput', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [tableOutput],
    handler: httpTriggerTableOutput,
});
