// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';
import { isMissingResult, notFound } from '../utils/httpValidation';

const sqlInput = input.sql({
    connectionStringSetting: 'SqlConnection',
    commandText: 'select * from dbo.e2eSqlNonTriggerTable where id = @id',
    commandType: 'Text',
    parameters: '@id={Query.id}',
});

export async function httpTriggerSqlInput(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`httpTriggerSqlInput was triggered`);

    const items = context.extraInputs.get(sqlInput);
    if (isMissingResult(items)) {
        return notFound(`No SQL rows were found for id "${request.query.get('id')}".`);
    }

    return { jsonBody: items };
}

app.http('httpTriggerSqlInput', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [sqlInput],
    handler: httpTriggerSqlInput,
});
