// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const cosmosDBInput1: AzureFunction = async function (context: Context, _request: HttpRequest): Promise<void> {
    context.res = {
        body: context.bindings.inputDoc.message,
    };
};

export default cosmosDBInput1;
