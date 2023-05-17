// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const timerTrigger: AzureFunction = async function (_context: Context, _myTimer: any): Promise<void> {
    console.log('timerTrigger1 was triggered');
};

export default timerTrigger;
