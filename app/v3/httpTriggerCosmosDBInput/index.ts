// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';
import { isMissingReadResult } from '../utils/httpValidation';

const httpTriggerCosmosDBInput: AzureFunction = async function (context: Context): Promise<void> {
    if (isMissingReadResult(context.bindings.inputDoc)) {
        context.res = { status: 404 };
        return;
    }

    context.res = {
        body: context.bindings.inputDoc.testData,
    };
};

export default httpTriggerCosmosDBInput;
