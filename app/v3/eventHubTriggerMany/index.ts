// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, messages: unknown[]): Promise<void> {
    context.log(`eventHubTriggerMany processed ${messages.length} messages`);
    for (const message of messages) {
        context.log(`eventHubTriggerMany was triggered by "${message}"`);
    }
};

export default eventHubTrigger;
