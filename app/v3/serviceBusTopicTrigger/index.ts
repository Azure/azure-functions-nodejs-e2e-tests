// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusTopicTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    context.log(`serviceBusTopicTrigger was triggered by "${mySbMsg}"`);
};

export default serviceBusTopicTrigger;
