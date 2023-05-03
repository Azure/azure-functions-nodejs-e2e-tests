// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { CosmosDBManagementClient } from '@azure/arm-cosmosdb';
import { CosmosClient } from '@azure/cosmos';
import { nonNullProp } from '../utils/nonNull';
import { ResourceInfo } from './ResourceInfo';

function getCosmosDBAccountName(info: ResourceInfo): string {
    return info.resourcePrefix + 'comsosdb';
}

export const dbName = 'e2eTestDB';
export const container1Name = 'e2eTestContainer1';
export const container2Name = 'e2eTestContainer2';

export async function createCosmosDB(info: ResourceInfo): Promise<void> {
    const accountName = getCosmosDBAccountName(info);
    const armClient = new CosmosDBManagementClient(info.creds, info.subscriptionId);
    await armClient.databaseAccounts.beginCreateOrUpdateAndWait(info.resourceGroupName, accountName, {
        location: info.location,
        databaseAccountOfferType: 'Standard',
        locations: [{ locationName: info.location }],
    });
    const connectionString = await getCosmosDBConnectionString(info);
    const client = new CosmosClient(connectionString);
    const res = await client.databases.create({
        id: dbName,
        throughput: 400,
    });
    for (const containerName of [container1Name, container2Name]) {
        await res.database.containers.create({
            id: containerName,
        });
    }
}

export async function getCosmosDBConnectionString(info: ResourceInfo): Promise<string> {
    const accountName = getCosmosDBAccountName(info);
    const client = new CosmosDBManagementClient(info.creds, info.subscriptionId);
    const keys = await client.databaseAccounts.listKeys(info.resourceGroupName, accountName);
    const key = nonNullProp(keys, 'primaryMasterKey');
    return `AccountEndpoint=https://${accountName}.documents.azure.com:443/;AccountKey=${key};`;
}
