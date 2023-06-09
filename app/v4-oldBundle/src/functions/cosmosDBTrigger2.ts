// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function cosmosDBTrigger2(documents: unknown[], _context: InvocationContext): Promise<void> {
    console.log(`cosmosDBTrigger2 processed ${documents.length} documents`);
    for (const document of documents) {
        console.log(`cosmosDBTrigger2 was triggered by "${(<any>document).message}"`);
    }
}

app.cosmosDB('cosmosDBTrigger2', {
    connectionStringSetting: 'e2eTest_cosmosDB',
    databaseName: 'e2eTestDB',
    collectionName: 'e2eTestContainer2',
    createLeaseCollectionIfNotExists: true,
    leaseCollectionPrefix: '2',
    handler: cosmosDBTrigger2,
});
