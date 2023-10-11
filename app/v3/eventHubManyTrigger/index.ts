// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, messages: unknown[]): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (typeof message === 'string') {
            context.log(`eventHubManyTrigger was triggered by string body "${message}"`);
        } else {
            context.log(`eventHubManyTrigger was triggered by object body "${JSON.stringify(message)}"`);
        }
        context.log(
            `eventHubManyTrigger message properties: "${JSON.stringify(context.bindingData.propertiesArray[i])}"`
        );
    }
};

export default eventHubTrigger;
