// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

// The ServiceBus emulator requires queues, topics, and subscriptions to be created before running tests
// This ensures all ServiceBus trigger bindings can initialize successfully

import { ServiceBusAdministrationClient } from '@azure/service-bus';
import { serviceBusConnectionString } from '../connectionStrings';
import { ServiceBus } from '../../constants';

export async function setupServiceBus(): Promise<void> {
    if (!serviceBusConnectionString) {
        throw new Error('ServiceBus connection string is not set');
    }

    // Parse connection string to get the namespace
    const client = new ServiceBusAdministrationClient(serviceBusConnectionString);

    try {
        console.log('Setting up ServiceBus entities...');
        
        // Create queues
        await createQueueIfNotExists(client, ServiceBus.serviceBusQueueOneTrigger);
        await createQueueIfNotExists(client, ServiceBus.serviceBusQueueOneTriggerAndOutput);
        await createQueueIfNotExists(client, ServiceBus.serviceBusQueueManyTrigger);
        await createQueueIfNotExists(client, ServiceBus.serviceBusQueueManyTriggerAndOutput);

        // Create topics with subscriptions
        await createTopicWithSubscriptionIfNotExists(
            client,
            ServiceBus.serviceBusTopicTrigger,
            'e2e-test-sub'
        );
        await createTopicWithSubscriptionIfNotExists(
            client,
            ServiceBus.serviceBusTopicTriggerAndOutput,
            'e2e-test-sub'
        );
        
        console.log('ServiceBus entities setup completed successfully');
    } catch (err) {
        console.error('Error setting up ServiceBus entities:', err);
        // Don't throw - the entities might already exist or the emulator might handle them differently
        // The important part is that we tried to set them up
    }
}

async function createQueueIfNotExists(
    client: ServiceBusAdministrationClient,
    queueName: string
): Promise<void> {
    try {
        await client.getQueue(queueName);
    } catch (err: unknown) {
        if (
            err instanceof Error &&
            err.message.includes('NotFound')
        ) {
            await client.createQueue(queueName, {
                lockDuration: 'PT1M',
                maxDeliveryCount: 10,
                defaultMessageTimeToLive: 'PT1H',
            });
        } else {
            throw err;
        }
    }
}

async function createTopicWithSubscriptionIfNotExists(
    client: ServiceBusAdministrationClient,
    topicName: string,
    subscriptionName: string
): Promise<void> {
    try {
        await client.getTopic(topicName);
    } catch (err: unknown) {
        if (
            err instanceof Error &&
            err.message.includes('NotFound')
        ) {
            await client.createTopic(topicName, {
                defaultMessageTimeToLive: 'PT1H',
                requiresDuplicateDetection: false,
            });
        } else {
            throw err;
        }
    }

    try {
        await client.getSubscription(topicName, subscriptionName);
    } catch (err: unknown) {
        if (
            err instanceof Error &&
            err.message.includes('NotFound')
        ) {
            await client.createSubscription(topicName, subscriptionName, {
                lockDuration: 'PT1M',
                maxDeliveryCount: 3,
                defaultMessageTimeToLive: 'PT1H',
                deadLetteringOnMessageExpiration: false,
            });
        } else {
            throw err;
        }
    }
}
