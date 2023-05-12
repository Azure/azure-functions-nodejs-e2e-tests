// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (_context: Context, messages: unknown[]): Promise<void> {
    console.log(`eventHubTriggerMany processed ${messages.length} messages`);
    for (const message of messages) {
        console.log(`eventHubTriggerMany was triggered by "${message}"`);
    }
};

export default eventHubTrigger;
