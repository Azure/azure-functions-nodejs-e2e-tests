// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, input } from '@azure/functions';

const tableInput = input.table({
    tableName: 'e2etesttable',
    partitionKey: 'e2eTestPartKey',
    filter: "RowKey eq '{rowKey}'",
    connection: 'e2eTest_storage',
});

export async function tableInput1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`tableInput1 was triggered`);
    const items = context.extraInputs.get(tableInput);
    return { jsonBody: items };
}

app.http('tableInput1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'tableInput1/{rowKey}',
    extraInputs: [tableInput],
    handler: tableInput1,
});
