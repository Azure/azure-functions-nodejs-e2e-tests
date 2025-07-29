// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

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
    const items = context.extraInputs.get(tableInput);
    return { jsonBody: items };
}

app.http('httpTriggerTableInput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'httpTriggerTableInput/{rowKey}',
    extraInputs: [tableInput],
    handler: httpTriggerTableInput,
});
