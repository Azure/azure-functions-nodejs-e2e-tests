// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { getResourceInfo } from './ResourceInfo';
import { getCosmosDBConnectionString } from './cosmosDB';
import { getEventHubConnectionString } from './eventHub';
import { getStorageConnectionString } from './storage';

export let storageConnectionString: string;
export let eventHubConnectionString: string;
export let cosmosDBConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    const info = getResourceInfo();
    [storageConnectionString, eventHubConnectionString, cosmosDBConnectionString] = await Promise.all([
        getStorageConnectionString(info),
        getEventHubConnectionString(info),
        getCosmosDBConnectionString(info),
    ]);
}
