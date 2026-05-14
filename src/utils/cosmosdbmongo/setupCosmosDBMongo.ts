// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { MongoClient } from 'mongodb';

import { CosmosDBMongo } from '../../constants';
import { cosmosDBMongoConnectionString } from '../connectionStrings';

export async function setupCosmosDBMongo(): Promise<void> {
    if (!cosmosDBMongoConnectionString) {
        throw new Error('Cosmos DB Mongo connection string is not set');
    }

    const client = new MongoClient(cosmosDBMongoConnectionString);
    try {
        await client.connect();
        const database = client.db(CosmosDBMongo.dbName);
        await createCollectionIfNotExists(database, CosmosDBMongo.collectionName);
        await createCollectionIfNotExists(database, CosmosDBMongo.leaseCollectionName);
        await database.collection(CosmosDBMongo.collectionName).deleteMany({});
        await database.collection(CosmosDBMongo.leaseCollectionName).deleteMany({});
    } finally {
        await client.close();
    }
}

async function createCollectionIfNotExists(
    database: ReturnType<MongoClient['db']>,
    collectionName: string
): Promise<void> {
    const collections = await database.listCollections({ name: collectionName }, { nameOnly: true }).toArray();
    if (collections.length === 0) {
        await database.createCollection(collectionName);
    }
}
