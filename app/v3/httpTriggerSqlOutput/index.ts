// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getJsonBody, hasItemsWithRequiredStringFields } from '../utils/httpValidation';

const httpTriggerSqlOutput: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    const body = getJsonBody(request);
    if (!hasItemsWithRequiredStringFields(body, ['id', 'testData'])) {
        context.res = { status: 400 };
        return;
    }

    context.log(`httpTriggerSqlOutput was triggered`);
    context.bindings.outputItem = body;
    context.res = {
        status: 201,
    };
};

export default httpTriggerSqlOutput;
