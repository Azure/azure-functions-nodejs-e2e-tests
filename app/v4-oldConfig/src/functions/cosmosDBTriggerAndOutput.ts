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
    connectionStringSetting: 'CosmosDBConnection',
    databaseName: 'e2eTestDB',
    collectionName: 'e2eTestContainerTriggerAndOutput',
    createLeaseCollectionIfNotExists: true,
    leaseCollectionPrefix: '1',
    return: output.cosmosDB({
        connectionStringSetting: 'CosmosDBConnection',
        databaseName: 'e2eTestDB',
        collectionName: 'e2eTestContainerTrigger',
    }),
    handler: cosmosDBTriggerAndOutput,
});
