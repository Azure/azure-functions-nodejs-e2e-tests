// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { getEventHubConnectionString } from './eventHub';
import { getResourceInfo } from './ResourceInfo';
import { getSqlConnectionString } from './sql';
import { getStorageConnectionString } from './storage';

export let storageConnectionString: string;
export let eventHubConnectionString: string;
export let sqlConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    const info = await getResourceInfo();
    [storageConnectionString, eventHubConnectionString, sqlConnectionString] = await Promise.all([
        getStorageConnectionString(info),
        getEventHubConnectionString(info),
        getSqlConnectionString(info),
    ]);
}
