// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export namespace EnvVarNames {
    export const storage = 'AzureWebJobsStorage';
    export const cosmosDB = 'CosmosDBConnection';
    export const eventHub = 'EventHubConnection';
    export const serviceBus = 'ServiceBusConnection';
    export const sql = 'SqlConnection';
    export const functionKey = 'FUNCTIONS_TEST_KEY';
}

export namespace CosmosDB {
    export const dbName = 'e2eTestCosmosDB';
    export const triggerAndOutputContainerName = 'e2eTestContainerTriggerAndOutput';
    export const triggerContainerName = 'e2eTestContainerTrigger';
    export const triggerDatabaseName = 'e2eTestCosmosDB';
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
    export const serviceBusTestFileName = 'serviceBus.test';
}

export namespace Sql {
    export const dbName = 'e2eTestDB';
    export const sqlTriggerTable = 'e2eSqlTriggerTable';
    export const sqlNonTriggerTable = 'e2eSqlNonTriggerTable';
}

export namespace MCP {
    export const streamableUrl = 'http://127.0.0.1:7071/runtime/webhooks/mcp';
    export const sseUrl = 'http://127.0.0.1:7071/runtime/webhooks/mcp/sse';
    export const legacySseUrl = 'http://127.0.0.1:7071/runtime/mcp/sse';
    export const messageUrl = 'http://127.0.0.1:7071/runtime/webhooks/mcp/sse/message';
    export const searchToolName = 'searchTool';
    export const testConfigResourceUri = 'mcp://test/config';
    export const testConfigResourceName = 'testConfig';
}

export const defaultTimeout = 3 * 60 * 1000;

export const combinedFolder = 'combined';
export const oldConfigSuffix = '-oldConfig';

export const jsonContentTypeHeaders = {
    'content-type': 'application/json',
};

type QueryParamValue = string | number | boolean;
type QueryParamInput = QueryParamValue | QueryParamValue[] | undefined;

export function getFuncUrl(routeSuffix: string, queryParams?: Record<string, QueryParamInput>): string {
    const url = new URL(`http://127.0.0.1:7071/api/${routeSuffix}`);
    const functionKey = process.env[EnvVarNames.functionKey];
    if (functionKey) {
        url.searchParams.set('code', functionKey);
    }

    if (queryParams) {
        for (const name in queryParams) {
            if (!Object.prototype.hasOwnProperty.call(queryParams, name)) {
                continue;
            }

            const value = queryParams[name];
            if (value === undefined) {
                continue;
            }

            const values = Array.isArray(value) ? value : [value];
            for (const item of values) {
                url.searchParams.append(name, String(item));
            }
        }
    }

    return url.toString();
}
