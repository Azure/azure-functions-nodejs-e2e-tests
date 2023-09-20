// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, output } from '@azure/functions';

const sqlOutput = output.sql({
    connectionStringSetting: 'e2eTest_sql',
    commandText: 'dbo.e2eTestTable',
});

export async function sqlOutput1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`sqlOutput1 was triggered`);
    const body = await request.json();
    context.extraOutputs.set(sqlOutput, body);
    return { status: 201 };
}

app.http('sqlOutput1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [sqlOutput],
    handler: sqlOutput1,
});
