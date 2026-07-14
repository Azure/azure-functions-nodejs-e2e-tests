// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';
import { getRequiredJsonBody, hasRequiredStringFields, validateObjectOrArray } from '../utils/httpValidation';

const sqlOutput = output.sql({
    connectionStringSetting: 'SqlConnection',
    commandText: 'dbo.e2eSqlNonTriggerTable',
});

export async function httpTriggerSqlOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`httpTriggerSqlOutput was triggered`);

    const bodyResult = await getRequiredJsonBody(request);
    if ('response' in bodyResult) {
        return bodyResult.response;
    }

    const validationError = validateObjectOrArray(
        bodyResult.value,
        (item) => hasRequiredStringFields(item, ['id', 'testData']),
        'Request body must include SQL rows with non-empty "id" and "testData" values.'
    );
    if (validationError) {
        return validationError;
    }

    context.extraOutputs.set(sqlOutput, bodyResult.value);
    return { status: 201 };
}

app.http('httpTriggerSqlOutput', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [sqlOutput],
    handler: httpTriggerSqlOutput,
});
