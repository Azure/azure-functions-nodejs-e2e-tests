// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext } from '@azure/functions';

// export async function cosmosDBTrigger(documents: unknown[], context: InvocationContext): Promise<void> {
//     context.log(`cosmosDBTrigger processed ${documents.length} documents`);
//     for (const document of documents) {
//         context.log(`cosmosDBTrigger was triggered by "${(<any>document).testData}"`);
//     }
// }

// app.cosmosDB('cosmosDBTrigger', {
//     connection: 'e2eTest_cosmosDB',
//     databaseName: 'e2eTestDB',
//     containerName: 'e2eTestContainerTrigger',
//     createLeaseContainerIfNotExists: true,
//     leaseContainerPrefix: '2',
//     handler: cosmosDBTrigger,
// });
