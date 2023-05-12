// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const eventHubTrigger: AzureFunction = async function (_context: Context, message: unknown): Promise<void> {
    console.log(`eventHubTriggerOne was triggered by "${message}"`);
};

export default eventHubTrigger;
