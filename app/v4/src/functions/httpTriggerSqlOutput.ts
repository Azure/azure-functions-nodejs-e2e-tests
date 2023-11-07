// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const sqlOutput = output.sql({
    connectionStringSetting: 'e2eTest_sql',
    commandText: 'dbo.e2eTestTable',
});

export async function httpTriggerSqlOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`httpTriggerSqlOutput was triggered`);
    const body = await request.json();
    context.extraOutputs.set(sqlOutput, body);
    return { status: 201 };
}

app.http('httpTriggerSqlOutput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [sqlOutput],
    handler: httpTriggerSqlOutput,
});
