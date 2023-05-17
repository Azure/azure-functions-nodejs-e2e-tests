// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusTopicTrigger: AzureFunction = async function (_context: Context, mySbMsg: any): Promise<void> {
    console.log(`serviceBusTopicTrigger2 was triggered by "${mySbMsg}"`);
};

export default serviceBusTopicTrigger;
