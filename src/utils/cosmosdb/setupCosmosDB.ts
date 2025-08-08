// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

// The CosmosDB emulator requires a container and database to be created before running tests but after the emulator starts
// Otherwise the following error will occur:
// Microsoft.Azure.Cosmos.Client: This builder instance has already been used to build a processor. Create a new instance to build another.

import { CosmosClient, PartitionKeyKind } from '@azure/cosmos';
import { cosmosDBConnectionString } from '../connectionStrings';
import { CosmosDB } from '../../constants';
import { delay } from '../delay';

export async function setupCosmosDB() {
  try {
    const partitionKeyPath = `/${CosmosDB.partitionKey}`;
    if (!cosmosDBConnectionString) {
      throw new Error('CosmosDB connection string is not set');
    }
    const client = new CosmosClient(cosmosDBConnectionString);
    await client.databases.createIfNotExists({ id: CosmosDB.triggerDatabaseName });
    await client.database(CosmosDB.triggerDatabaseName).containers.createIfNotExists({
      id: CosmosDB.triggerContainerName,
      partitionKey: { paths: [partitionKeyPath], kind: PartitionKeyKind.Hash }
    });
    await client.database(CosmosDB.triggerDatabaseName).containers.createIfNotExists({
      id: CosmosDB.triggerAndOutputContainerName,
      partitionKey: { paths: [partitionKeyPath], kind: PartitionKeyKind.Hash }
    });
} catch (error) {
    console.error('Error setting up CosmosDB:', error);
    throw error;
  }
  await delay(30000);
}