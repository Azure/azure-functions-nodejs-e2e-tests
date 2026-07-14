// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRouteParam, isMissingReadResult } from '../utils/httpValidation';

const httpTriggerTableInput: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    const rowKey = getRouteParam(request, 'rowKey');
    if (!rowKey) {
        context.res = { status: 400 };
        return;
    }

    context.log(`httpTriggerTableInput was triggered`);

    if (isMissingReadResult(context.bindings.inputItem)) {
        context.res = { status: 404 };
        return;
    }

    context.res = {
        body: context.bindings.inputItem,
    };
};

export default httpTriggerTableInput;
