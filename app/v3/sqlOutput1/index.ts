// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const sqlOutput1: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    context.log(`sqlOutput1 was triggered`);
    context.bindings.outputItem = request.body;
    context.res = {
        status: 201,
    };
};

export default sqlOutput1;
