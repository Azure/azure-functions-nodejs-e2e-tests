// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit, InvocationContext, app, input } from '@azure/functions';

const sqlInput = input.sql({
    connectionStringSetting: 'e2eTest_sql',
    commandText: 'select * from dbo.e2eTestTable where id = @id',
    commandType: 'Text',
    parameters: '@id={Query.id}',
});

export async function httpTriggerSqlInput(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`httpTriggerSqlInput was triggered`);
    const items = context.extraInputs.get(sqlInput);
    return { jsonBody: items };
}

app.http('httpTriggerSqlInput', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [sqlInput],
    handler: httpTriggerSqlInput,
});
