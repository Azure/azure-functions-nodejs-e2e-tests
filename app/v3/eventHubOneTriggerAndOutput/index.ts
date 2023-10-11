// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, message: unknown): Promise<unknown> {
    if (typeof message === 'string') {
        context.log(`eventHubOneTriggerAndOutput was triggered by string body "${message}"`);
    } else {
        context.log(`eventHubOneTriggerAndOutput was triggered by object body "${JSON.stringify(message)}"`);
    }
    context.log(`eventHubOneTriggerAndOutput message properties: "${JSON.stringify(context.bindingData.properties)}"`);
    return message;
};

export default eventHubTrigger;
