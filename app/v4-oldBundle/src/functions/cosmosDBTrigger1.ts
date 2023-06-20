// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function cosmosDBTrigger1(documents: unknown[], _context: InvocationContext): Promise<unknown[]> {
    console.log(`cosmosDBTrigger1 processed ${documents.length} documents`);
    for (const document of documents) {
        console.log(`cosmosDBTrigger1 was triggered by "${(<any>document).message}"`);
    }
    return documents;
}

app.cosmosDB('cosmosDBTrigger1', {
    connectionStringSetting: 'e2eTest_cosmosDB',
    databaseName: 'e2eTestDB',
    collectionName: 'e2eTestContainer1',
    createLeaseCollectionIfNotExists: true,
    leaseCollectionPrefix: '1',
    return: output.cosmosDB({
        connectionStringSetting: 'e2eTest_cosmosDB',
        databaseName: 'e2eTestDB',
        collectionName: 'e2eTestContainer2',
    }),
    handler: cosmosDBTrigger1,
});
