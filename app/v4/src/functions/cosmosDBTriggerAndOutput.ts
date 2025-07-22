// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function cosmosDBTriggerAndOutput(documents: unknown[], context: InvocationContext): Promise<unknown[]> {
    context.log(`cosmosDBTriggerAndOutput processed ${documents.length} documents`);
    for (const document of documents) {
        context.log(`cosmosDBTriggerAndOutput was triggered by "${(<any>document).testData}"`);
    }
    return documents;
}

app.cosmosDB('cosmosDBTriggerAndOutput', {
    connection: 'CosmosDBConnection',
    databaseName: 'e2eTestDB',
    containerName: 'e2eTestContainerTriggerAndOutput',
    createLeaseContainerIfNotExists: true,
    leaseContainerPrefix: '1',
    return: output.cosmosDB({
        connection: 'CosmosDBConnection',
        databaseName: 'e2eTestDB',
        containerName: 'e2eTestContainerTrigger',
    }),
    handler: cosmosDBTriggerAndOutput,
});
