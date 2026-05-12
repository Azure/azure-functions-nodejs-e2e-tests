// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getQueryParam, isMissingReadResult } from '../utils/httpValidation';

const httpTriggerCosmosDBInput: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    const id = getQueryParam(request, 'id');
    if (!id) {
        context.res = { status: 400 };
        return;
    }

    if (isMissingReadResult(context.bindings.inputDoc)) {
        context.res = { status: 404 };
        return;
    }

    context.res = {
        body: context.bindings.inputDoc.testData,
    };
};

export default httpTriggerCosmosDBInput;
