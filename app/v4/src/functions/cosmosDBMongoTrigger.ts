// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

interface CosmosDBMongoChangeDocument {
    operationType?: string;
    fullDocument?: {
        _id?: string;
        testData?: string;
    };
    documentKey?: {
        _id?: string;
    };
}

export async function cosmosDBMongoTrigger(
    change: CosmosDBMongoChangeDocument,
    context: InvocationContext
): Promise<void> {
    const document = change.fullDocument;
    const documentId = document?._id ?? change.documentKey?._id;
    context.log(`cosmosDBMongoTrigger operation "${change.operationType}" for "${documentId}"`);
    context.log(`cosmosDBMongoTrigger was triggered by "${document?.testData}"`);
}

(app as any).cosmosDBMongo('cosmosDBMongoTrigger', {
    connectionStringSetting: 'CosmosDBMongoConnection',
    databaseName: 'e2eTestMongoDB',
    collectionName: 'e2eTestMongoCollection',
    createIfNotExists: true,
    leaseDatabaseName: 'e2eTestMongoDB',
    leaseCollectionName: 'e2eTestMongoLeases',
    handler: cosmosDBMongoTrigger,
});
