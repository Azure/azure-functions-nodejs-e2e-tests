// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const tableInput1: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
    context.log(`tableInput1 was triggered`);
    context.res = {
        body: context.bindings.inputItem,
    };
};

export default tableInput1;
