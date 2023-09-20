// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const tableOutput1: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    context.log(`tableOutput1 was triggered`);
    context.bindings.outputItem = request.body;
    context.res = {
        status: 201,
    };
};

export default tableOutput1;
