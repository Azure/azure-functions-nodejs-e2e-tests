// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTriggerTableInput: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    context.log(`httpTriggerTableInput was triggered`);
    context.res = {
        body: context.bindings.inputItem,
    };
};

export default httpTriggerTableInput;
