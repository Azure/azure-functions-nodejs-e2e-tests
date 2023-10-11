// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, messages: unknown[]): Promise<unknown[]> {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (typeof message === 'string') {
            context.log(`eventHubManyTriggerAndOutput was triggered by string body "${message}"`);
        } else {
            context.log(`eventHubManyTriggerAndOutput was triggered by object body "${JSON.stringify(message)}"`);
        }
        context.log(
            `eventHubManyTriggerAndOutput message properties: "${JSON.stringify(
                context.bindingData.propertiesArray[i]
            )}"`
        );
    }

    // do an extra stringify to make sure the values are JSON-parse-able otherwise it'll hit this bug:
    // https://github.com/Azure/azure-functions-eventhubs-extension/issues/118
    return messages.map((m) => JSON.stringify(m));
};

export default eventHubTrigger;
