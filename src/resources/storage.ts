// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { KnownKind, KnownSkuName, StorageManagementClient } from '@azure/arm-storage';
import { nonNullProp, nonNullValue } from '../utils/nonNull';
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
    });
}

export async function getStorageConnectionString(info: ResourceInfo): Promise<string> {
    const client = new StorageManagementClient(info.creds, info.subscriptionId);
    const accountName = getAccountName(info);
    const keys = await client.storageAccounts.listKeys(info.resourceGroupName, accountName);
    const key = nonNullValue(nonNullProp(keys, 'keys')[0]?.value, 'storageKey');
    return `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${key};EndpointSuffix=core.windows.net`;
}
