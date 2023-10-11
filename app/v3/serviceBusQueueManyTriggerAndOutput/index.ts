// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const serviceBusQueueTrigger: AzureFunction = async function (context: Context, messages: any): Promise<string> {
    for (const message of messages) {
        context.log(`serviceBusQueueManyTriggerAndOutput was triggered by "${message}"`);
    }

    // do an extra stringify to make sure the values are JSON-parse-able otherwise it'll hit this bug:
    // https://github.com/Azure/azure-functions-eventhubs-extension/issues/118
    return messages.map((m) => JSON.stringify(m));
};

export default serviceBusQueueTrigger;
