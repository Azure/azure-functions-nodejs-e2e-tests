// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EventHubManagementClient, KnownSkuName } from '@azure/arm-eventhub';
import { nonNullProp } from '../utils/nonNull';
import { ResourceInfo } from './ResourceInfo';

function getNamespaceName(info: ResourceInfo): string {
    return info.resourcePrefix + 'eventhub';
}

export const eventHubOne = 'e2etesteventhubone';
export const eventHubMany = 'e2etesteventhubmany';

export async function createEventHub(info: ResourceInfo): Promise<void> {
    const client = new EventHubManagementClient(info.creds, info.subscriptionId);
    const namespaceName = getNamespaceName(info);
    await client.namespaces.beginCreateOrUpdateAndWait(info.resourceGroupName, namespaceName, {
        location: info.location,
        sku: {
            name: KnownSkuName.Standard,
        },
    });
    for (const eventHubName of [eventHubOne, eventHubMany]) {
        await client.eventHubs.createOrUpdate(info.resourceGroupName, namespaceName, eventHubName, {
            messageRetentionInDays: 1,
        });
    }
}

export async function getEventHubConnectionString(info: ResourceInfo): Promise<string> {
    const client = new EventHubManagementClient(info.creds, info.subscriptionId);
    const keys = await client.namespaces.listKeys(
        info.resourceGroupName,
        getNamespaceName(info),
        'RootManageSharedAccessKey'
    );
    return nonNullProp(keys, 'primaryConnectionString');
}
