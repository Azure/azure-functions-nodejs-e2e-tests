// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const queueTrigger: AzureFunction = async function (_context: Context, myQueueItem: string): Promise<void> {
    console.log(`storageQueueTrigger2 was triggered by "${myQueueItem}"`);
};

export default queueTrigger;
