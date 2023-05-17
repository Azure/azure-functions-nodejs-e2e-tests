// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusQueueTrigger: AzureFunction = async function (_context: Context, mySbMsg: any): Promise<void> {
    console.log(`serviceBusQueueTrigger2 was triggered by "${mySbMsg}"`);
};

export default serviceBusQueueTrigger;
