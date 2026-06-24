// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export async function cosmosDBMongoTrigger(change: any, context: InvocationContext): Promise<void> {
    const document = change && change.fullDocument;
    const documentId = (document && document._id) || (change && change.documentKey && change.documentKey._id);

    context.log(`cosmosDBMongoTrigger operation "${change && change.operationType}" for "${documentId}"`);
    context.log(`cosmosDBMongoTrigger saw "${document && document.testData}"`);
}

app.cosmosDBMongo('cosmosDBMongoTrigger', {
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestCosmosDBMongo',
    collectionName: 'e2eTestCollectionTrigger',
    createIfNotExists: true,
    leaseDatabaseName: 'e2eTestCosmosDBMongo',
    leaseCollectionName: 'e2eLeasesTrigger',
    handler: cosmosDBMongoTrigger,
});
