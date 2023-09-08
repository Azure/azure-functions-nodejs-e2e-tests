// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, message: unknown): Promise<void> {
    context.log(`eventHubTriggerOne2 was triggered by "${message}"`);
};

export default eventHubTrigger;
