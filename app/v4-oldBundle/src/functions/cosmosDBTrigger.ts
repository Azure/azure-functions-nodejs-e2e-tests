// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function cosmosDBTrigger(documents: unknown[], context: InvocationContext): Promise<void> {
    context.log(`cosmosDBTrigger processed ${documents.length} documents`);
    for (const document of documents) {
        context.log(`cosmosDBTrigger was triggered by "${(<any>document).testData}"`);
    }
}

app.cosmosDB('cosmosDBTrigger', {
    connectionStringSetting: 'e2eTest_cosmosDB',
    databaseName: 'e2eTestDB',
    collectionName: 'e2eTestContainerTrigger',
    createLeaseCollectionIfNotExists: true,
    leaseCollectionPrefix: '2',
    handler: cosmosDBTrigger,
});
