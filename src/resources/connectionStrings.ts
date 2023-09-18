// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { getResourceInfo } from './ResourceInfo';
import { getCosmosDBConnectionString } from './cosmosDB';
import { getEventHubConnectionString } from './eventHub';
import { getServiceBusConnectionString } from './serviceBus';
import { getSqlConnectionString } from './sql';
import { getStorageConnectionString } from './storage';

export let storageConnectionString: string;
export let eventHubConnectionString: string;
export let cosmosDBConnectionString: string;
export let serviceBusConnectionString: string;
export let sqlConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    const info = getResourceInfo();
    [
        storageConnectionString,
        eventHubConnectionString,
        cosmosDBConnectionString,
        serviceBusConnectionString,
        sqlConnectionString,
    ] = await Promise.all([
        getStorageConnectionString(info),
        getEventHubConnectionString(info),
        getCosmosDBConnectionString(info),
        getServiceBusConnectionString(info),
        getSqlConnectionString(info),
    ]);
}
