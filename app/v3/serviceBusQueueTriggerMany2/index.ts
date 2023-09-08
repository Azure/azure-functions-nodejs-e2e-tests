// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusQueueTrigger: AzureFunction = async function (context: Context, messages: any): Promise<void> {
    for (const message of messages) {
        context.log(`serviceBusQueueTriggerMany2 was triggered by "${message}"`);
    }
};

export default serviceBusQueueTrigger;
