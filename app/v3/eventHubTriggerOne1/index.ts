// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (context: Context, message: unknown): Promise<unknown> {
    context.log(`eventHubTriggerOne1 was triggered by "${message}"`);
    return message;
};

export default eventHubTrigger;
