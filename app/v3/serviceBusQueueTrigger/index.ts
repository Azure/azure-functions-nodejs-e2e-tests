// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusQueueTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    context.log(`serviceBusQueueTrigger was triggered by "${mySbMsg}"`);
};

export default serviceBusQueueTrigger;
