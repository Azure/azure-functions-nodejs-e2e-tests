// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const sqlInput1: AzureFunction = async function (context: Context, _request: HttpRequest): Promise<void> {
    context.log(`sqlInput1 was triggered`);
    context.res = {
        body: context.bindings.inputItem,
    };
};

export default sqlInput1;
