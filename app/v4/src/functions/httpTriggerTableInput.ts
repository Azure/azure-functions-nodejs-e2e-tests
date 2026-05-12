// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';
import { getRequiredRouteParam, isMissingResult, notFound } from '../utils/httpValidation';

const tableInput = input.table({
    tableName: 'e2etesttable',
    partitionKey: 'e2eTestPartKey',
    filter: "RowKey eq '{rowKey}'",
    connection: 'AzureWebJobsStorage',
});

export async function httpTriggerTableInput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`httpTriggerTableInput was triggered`);

    const rowKeyResult = getRequiredRouteParam(request, 'rowKey');
    if ('response' in rowKeyResult) {
        return rowKeyResult.response;
    }

    const items = context.extraInputs.get(tableInput);
    if (isMissingResult(items)) {
        return notFound(`No table entities were found for rowKey "${rowKeyResult.value}".`);
    }

    return { jsonBody: items };
}

app.http('httpTriggerTableInput', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'httpTriggerTableInput/{rowKey}',
    extraInputs: [tableInput],
    handler: httpTriggerTableInput,
});
