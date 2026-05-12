// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getJsonBody, hasItemsWithRequiredStringFields } from '../utils/httpValidation';

const httpTriggerCosmosDBOutput: AzureFunction = async function (
    context: Context,
    request: HttpRequest
): Promise<void> {
    const body = getJsonBody(request);
    if (!hasItemsWithRequiredStringFields(body, ['id', 'testData'])) {
        context.res = { status: 400 };
        return;
    }

    context.bindings.outputDoc = body;
    context.res = { body: 'done' };
};

export default httpTriggerCosmosDBOutput;
