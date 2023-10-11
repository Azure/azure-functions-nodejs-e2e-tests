// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ServiceBusManagementClient } from '@azure/arm-servicebus';
import { nonNullProp } from '../utils/nonNull';
import { ResourceInfo } from './ResourceInfo';

function getNamespaceName(info: ResourceInfo): string {
    return info.resourcePrefix + 'servicebus';
}

export const serviceBusQueueOneTriggerAndOutput = 'e2eTestQueueOneTriggerAndOutput';
export const serviceBusQueueOneTrigger = 'e2eTestQueueOneTrigger';
export const serviceBusQueueManyTriggerAndOutput = 'e2eTestQueueManyTriggerAndOutput';
export const serviceBusQueueManyTrigger = 'e2eTestQueueManyTrigger';

export const serviceBusTopicTriggerAndOutput = 'e2eTestTopicTriggerAndOutput';
export const serviceBusTopicTrigger = 'e2eTestTopicTrigger';

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

    for (const queueName of [
        serviceBusQueueOneTriggerAndOutput,
        serviceBusQueueOneTrigger,
        serviceBusQueueManyTriggerAndOutput,
        serviceBusQueueManyTrigger,
    ]) {
        await client.queues.createOrUpdate(info.resourceGroupName, namespaceName, queueName, {});
    }

    for (const topicName of [serviceBusTopicTriggerAndOutput, serviceBusTopicTrigger]) {
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
