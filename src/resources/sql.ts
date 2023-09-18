// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { SqlManagementClient } from '@azure/arm-sql';
import * as sql from 'mssql';
import { default as fetch } from 'node-fetch';
import { ResourceInfo } from './ResourceInfo';

/**
 * Various helpful sql docs:
 * https://github.com/Azure/azure-functions-sql-extension/blob/main/docs/GeneralSetup.md
 * https://github.com/Azure/azure-functions-sql-extension/blob/main/docs/SetupGuide_Javascript.md
 * https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs
 * https://learn.microsoft.com/en-us/azure/azure-sql/database/azure-sql-javascript-mssql-quickstart
 */

function getSqlAccountName(info: ResourceInfo): string {
    return info.resourcePrefix + 'sql';
}

export const dbName = 'e2eTestDB';

export async function createSql(info: ResourceInfo): Promise<void> {
    const serverName = getSqlAccountName(info);
    const armClient = new SqlManagementClient(info.creds, info.subscriptionId);
    await armClient.servers.beginCreateOrUpdateAndWait(info.resourceGroupName, serverName, {
        location: info.location,
        administrators: {
            administratorType: 'ActiveDirectory',
            principalType: 'Application',
            sid: info.clientId,
            tenantId: info.tenantId,
            azureADOnlyAuthentication: true,
            login: 'e2eserviceprincipal',
        },
    });
    const ipAddress = await getPublicIpAddress();
    await armClient.firewallRules.createOrUpdate(info.resourceGroupName, serverName, 'e2eTestFirewall', {
        startIpAddress: ipAddress,
        endIpAddress: ipAddress,
    });
    await armClient.databases.beginCreateOrUpdateAndWait(info.resourceGroupName, serverName, dbName, {
        location: info.location,
        sku: {
            name: 'GP_S_Gen5_1',
            tier: 'GeneralPurpose',
        },
    });

    await createTable(info);
}

async function getPublicIpAddress(): Promise<string> {
    const response = await fetch('https://api.ipify.org/');
    return response.text();
}

async function createTable(info: ResourceInfo) {
    const serverName = getSqlAccountName(info);
    const poolConnection = await sql.connect({
        server: `${serverName}.database.windows.net`,
        database: dbName,
        port: 1433,
        authentication: {
            type: 'azure-active-directory-service-principal-secret',
            options: <any>{
                clientId: info.clientId,
                tenantId: info.tenantId,
                clientSecret: info.secret,
            },
        },
        options: {
            encrypt: true,
        },
    });

    try {
        await poolConnection
            .request()
            .query(
                `CREATE TABLE dbo.e2eTestTable ([id] UNIQUEIDENTIFIER PRIMARY KEY, [testData] NVARCHAR(200) NOT NULL);`
            );
    } finally {
        await poolConnection.close();
    }
}

export async function getSqlConnectionString(info: ResourceInfo): Promise<string> {
    const serverName = getSqlAccountName(info);
    return `Server=${serverName}.database.windows.net; Authentication=Active Directory Service Principal; Encrypt=True; Database=${dbName}; User Id=${info.clientId}; Password=${info.secret}`;
}
