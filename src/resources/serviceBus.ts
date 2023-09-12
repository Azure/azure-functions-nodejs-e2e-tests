// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ServiceBusManagementClient } from '@azure/arm-servicebus';
import { nonNullProp } from '../utils/nonNull';
import { ResourceInfo } from './ResourceInfo';

function getNamespaceName(info: ResourceInfo): string {
    return info.resourcePrefix + 'servicebus';
}

export const serviceBusQueue1 = 'e2etestqueue1';
export const serviceBusQueue2 = 'e2etestqueue2';
export const serviceBusQueueMany1 = 'e2etestqueuemany1';
export const serviceBusQueueMany2 = 'e2etestqueuemany2';

export const serviceBusTopic1 = 'e2etesttopic1';
export const serviceBusTopic2 = 'e2etesttopic2';

export const serviceBusSub = 'e2etestsub';

export async function createServiceBus(info: ResourceInfo): Promise<void> {
    const client = new ServiceBusManagementClient(info.creds, info.subscriptionId);
    const namespaceName = getNamespaceName(info);
    await client.namespaces.beginCreateOrUpdateAndWait(info.resourceGroupName, namespaceName, {
        location: info.location,
        sku: {
            name: 'Standard',
        },
    });

    for (const queueName of [serviceBusQueue1, serviceBusQueue2, serviceBusQueueMany1, serviceBusQueueMany2]) {
        await client.queues.createOrUpdate(info.resourceGroupName, namespaceName, queueName, {});
    }

    for (const topicName of [serviceBusTopic1, serviceBusTopic2]) {
        await client.topics.createOrUpdate(info.resourceGroupName, namespaceName, topicName, {});
        await client.subscriptions.createOrUpdate(info.resourceGroupName, namespaceName, topicName, serviceBusSub, {});
    }
}

export async function getServiceBusConnectionString(info: ResourceInfo): Promise<string> {
    const client = new ServiceBusManagementClient(info.creds, info.subscriptionId);
    const keys = await client.namespaces.listKeys(
        info.resourceGroupName,
        getNamespaceName(info),
        'RootManageSharedAccessKey'
    );
    return nonNullProp(keys, 'primaryConnectionString');
}
