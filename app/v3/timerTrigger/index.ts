// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const timerTrigger: AzureFunction = async function (context: Context, _myTimer: any): Promise<void> {
    context.log('timerTrigger was triggered');
};

export default timerTrigger;
