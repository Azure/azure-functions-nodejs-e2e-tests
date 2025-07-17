// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const timerTrigger: AzureFunction = async function (context: Context, _myTimer: any): Promise<void> {
    const retryCount = context.executionContext.retryContext?.retryCount ?? 0;
    if (retryCount < 2) {
        throw new Error(`timerTriggerWithRetry error on attempt ${retryCount}`);
    }
    context.log(`timerTriggerWithRetry pass on attempt ${retryCount}`);
};

export default timerTrigger;
