// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusQueueTrigger: AzureFunction = async function (_context: Context, mySbMsg: any): Promise<string> {
    console.log(`serviceBusQueueTrigger1 was triggered by "${mySbMsg}"`);
    return mySbMsg;
};

export default serviceBusQueueTrigger;
