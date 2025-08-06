// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export namespace EnvVarNames {
    export const storage = 'AzureWebJobsStorage';
    export const cosmosDB = 'CosmosDBConnection';
    export const eventHub = 'EventHubConnection';
    export const serviceBus = 'ServiceBusConnection';
    export const sql = 'SqlConnection';
}

export namespace CosmosDB {
    export const dbName = 'e2eTestDB';
    export const triggerAndOutputContainerName = 'e2eTestContainerTriggerAndOutput';
    export const triggerContainerName = 'e2eTestContainerTrigger';
    export const triggerDatabaseName = 'e2eTestDB';
    export const partitionKey = 'testPartKey';
}

export namespace EventHub {
    export const eventHubOneTriggerAndOutput = 'e2e-test-hub-one-trigger-and-output';
    export const eventHubManyTriggerAndOutput = 'e2e-test-hub-many-trigger-and-output';
    export const eventHubOneTrigger = 'e2e-test-hub-one-trigger';
    export const eventHubManyTrigger = 'e2e-test-hub-many-trigger';
}

export namespace ServiceBus {
    export const serviceBusQueueOneTriggerAndOutput = 'e2e-test-queue-one-trigger-and-output';
    export const serviceBusQueueOneTrigger = 'e2e-test-queue-one-trigger';
    export const serviceBusQueueManyTriggerAndOutput = 'e2e-test-queue-many-trigger-and-output';
    export const serviceBusQueueManyTrigger = 'e2e-test-queue-many-trigger';
    export const serviceBusTopicTriggerAndOutput = 'e2e-test-topic-trigger-and-output';
    export const serviceBusTopicTrigger = 'e2e-test-topic-trigger';
}

export namespace Sql {
    export const dbName = 'master';
    export const sqlTriggerTable = 'e2eSqlTriggerTable';
    export const sqlNonTriggerTable = 'e2eSqlNonTriggerTable';
}

export const defaultTimeout = 3 * 60 * 1000;

export const combinedFolder = 'combined';
export const oldConfigSuffix = '-oldConfig';

export function getFuncUrl(routeSuffix: string): string {
    return `http://127.0.0.1:7071/api/${routeSuffix}`;
}
