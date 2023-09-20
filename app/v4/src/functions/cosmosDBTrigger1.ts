// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

export async function cosmosDBTrigger1(documents: unknown[], context: InvocationContext): Promise<unknown[]> {
    context.log(`cosmosDBTrigger1 processed ${documents.length} documents`);
    for (const document of documents) {
        context.log(`cosmosDBTrigger1 was triggered by "${(<any>document).testData}"`);
    }
    return documents;
}

app.cosmosDB('cosmosDBTrigger1', {
    connection: 'e2eTest_cosmosDB',
    databaseName: 'e2eTestDB',
    containerName: 'e2eTestContainer1',
    createLeaseContainerIfNotExists: true,
    leaseContainerPrefix: '1',
    return: output.cosmosDB({
        connection: 'e2eTest_cosmosDB',
        databaseName: 'e2eTestDB',
        containerName: 'e2eTestContainer2',
    }),
    handler: cosmosDBTrigger1,
});
