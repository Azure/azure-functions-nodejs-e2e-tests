// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, output } from '@azure/functions';

const cosmosDBMongoOutput = output.cosmosDBMongo({
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestCosmosDBMongo',
    collectionName: 'e2eTestCollectionTrigger',
    createIfNotExists: true,
});

export async function cosmosDBMongoTriggerAndOutput(change: any, context: InvocationContext): Promise<void> {
    const document = change && change.fullDocument;
    const documentId = (document && document._id) || (change && change.documentKey && change.documentKey._id);

    context.log(`cosmosDBMongoTriggerAndOutput operation "${change && change.operationType}" for "${documentId}"`);
    context.log(`cosmosDBMongoTriggerAndOutput saw "${document && document.testData}"`);

    if (document) {
        context.extraOutputs.set(cosmosDBMongoOutput, document);
    }
}

app.cosmosDBMongo('cosmosDBMongoTriggerAndOutput', {
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestCosmosDBMongo',
    collectionName: 'e2eTestCollectionTriggerAndOutput',
    createIfNotExists: true,
    leaseDatabaseName: 'e2eTestCosmosDBMongo',
    leaseCollectionName: 'e2eLeasesTriggerAndOutput',
    extraOutputs: [cosmosDBMongoOutput],
    handler: cosmosDBMongoTriggerAndOutput,
});
