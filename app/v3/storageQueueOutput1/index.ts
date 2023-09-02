// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const storageQueueOutput1: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    context.bindings.outputMsg = request.body.output;
    context.res = { body: 'done' };
};

export default storageQueueOutput1;
