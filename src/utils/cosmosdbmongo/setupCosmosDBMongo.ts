// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { MongoClient } from 'mongodb';
import { cosmosDBMongoConnectionString } from '../connectionStrings';
import { CosmosDBMongo } from '../../constants';

export async function setupCosmosDBMongo() {
    if (!cosmosDBMongoConnectionString) {
        throw new Error('CosmosDB Mongo connection string is not set');
    }
    const client = new MongoClient(cosmosDBMongoConnectionString);
    await client.connect();
    const db = client.db(CosmosDBMongo.dbName);
    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);
    if (!names.includes(CosmosDBMongo.triggerCollectionName)) {
        await db.createCollection(CosmosDBMongo.triggerCollectionName);
    }
    if (!names.includes(CosmosDBMongo.triggerAndOutputCollectionName)) {
        await db.createCollection(CosmosDBMongo.triggerAndOutputCollectionName);
    }
    await client.close();
}
