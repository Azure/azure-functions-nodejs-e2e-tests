// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, messages: unknown[]): Promise<void> {
    for (const message of messages) {
        context.log(`eventHubManyTrigger was triggered by "${message}"`);
    }
};

export default eventHubTrigger;
