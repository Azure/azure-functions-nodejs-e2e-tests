// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export namespace EnvVarNames {
    export const storage = 'AzureWebJobsStorage';
    export const cosmosDB = 'CosmosDBConnection';
    export const eventHub = 'EventHubConnection';
}

export namespace CosmosDB {
    export const dbName = 'e2eTestDB';
    export const triggerAndOutputContainerName = 'e2eTestContainerTriggerAndOutput';
    export const triggerContainerName = 'e2eTestContainerTrigger';
    export const triggerDatabaseName = 'e2eTestDB';
}

export namespace EventHub {
    export const eventHubOneTriggerAndOutput = 'e2e-test-hub-one-trigger-and-output';
    export const eventHubManyTriggerAndOutput = 'e2e-test-hub-many-trigger-and-output';
    export const eventHubOneTrigger = 'e2e-test-hub-one-trigger';
    export const eventHubManyTrigger = 'e2e-test-hub-many-trigger';
}

export const defaultTimeout = 3 * 60 * 1000;

export const combinedFolder = 'combined';
export const oldConfigSuffix = '-oldConfig';

export function getFuncUrl(routeSuffix: string): string {
    return `http://127.0.0.1:7071/api/${routeSuffix}`;
}
