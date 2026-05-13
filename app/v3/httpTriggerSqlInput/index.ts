// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';
import { isMissingReadResult } from '../utils/httpValidation';

const httpTriggerSqlInput: AzureFunction = async function (context: Context): Promise<void> {
    context.log(`httpTriggerSqlInput was triggered`);

    if (isMissingReadResult(context.bindings.inputItem)) {
        context.res = { status: 404 };
        return;
    }

    context.res = {
        body: context.bindings.inputItem,
    };
};

export default httpTriggerSqlInput;
