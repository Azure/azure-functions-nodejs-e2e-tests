// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { KnownKind, KnownSkuName, StorageManagementClient } from '@azure/arm-storage';
import { TableClient } from '@azure/data-tables';
import { ResourceInfo } from './ResourceInfo';

function getAccountName(info: ResourceInfo): string {
    return info.resourcePrefix + 'sto';
}

export async function createStorageAccount(info: ResourceInfo): Promise<void> {
    const client = new StorageManagementClient(info.creds, info.subscriptionId);
    await client.storageAccounts.beginCreateAndWait(info.resourceGroupName, getAccountName(info), {
        kind: KnownKind.StorageV2,
        location: info.location,
        sku: {
            name: KnownSkuName.StandardLRS,
        },
        allowBlobPublicAccess: false,
    });

    const connectionString = await getStorageConnectionString(info);
    const tableClient = TableClient.fromConnectionString(connectionString, 'e2etesttable');
    await tableClient.createTable();
}

export async function getStorageConnectionString(_info: ResourceInfo): Promise<string> {
    return 'UseDevelopmentStorage=true';
}
