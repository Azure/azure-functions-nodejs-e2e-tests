// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTriggerCosmosDBOutput: AzureFunction = async function (
    context: Context,
    request: HttpRequest
): Promise<void> {
    context.bindings.outputDoc = request.body;
    context.res = { body: 'done' };
};

export default httpTriggerCosmosDBOutput;
