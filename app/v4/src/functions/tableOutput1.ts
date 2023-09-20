// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, output } from '@azure/functions';

const tableOutput = output.table({
    tableName: 'e2etesttable',
    connection: 'e2eTest_storage',
});

export async function tableOutput1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`tableOutput1 was triggered`);
    const body = await request.json();
    context.extraOutputs.set(tableOutput, body);
    return { status: 201 };
}

app.http('tableOutput1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [tableOutput],
    handler: tableOutput1,
});
