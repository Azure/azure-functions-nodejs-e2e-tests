// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, message: unknown): Promise<void> {
    if (typeof message === 'string') {
        context.log(`eventHubOneTrigger was triggered by string body "${message}"`);
    } else {
        context.log(`eventHubOneTrigger was triggered by object body "${JSON.stringify(message)}"`);
    }
    context.log(`eventHubOneTrigger message properties: "${JSON.stringify(context.bindingData.properties)}"`);
};

export default eventHubTrigger;
