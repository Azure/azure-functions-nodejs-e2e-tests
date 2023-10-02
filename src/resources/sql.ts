// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { SqlManagementClient } from '@azure/arm-sql';
import * as sql from 'mssql';
import retry from 'p-retry';
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

    try {
        // Try to connect (which will fail) so that we can get the correct IP address to add to the firewall from the error message
        await createPoolConnnection(info);
    } catch (error) {
        const regexp = /Client with IP address '([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)' is not allowed to access the server/i;
        const match = (<Error>error).message.match(regexp);
        if (!match) {
            throw error;
        }

        const ipAddress = match[1];
        await armClient.firewallRules.createOrUpdate(info.resourceGroupName, serverName, 'e2eTestFirewall', {
            startIpAddress: ipAddress,
            endIpAddress: ipAddress,
        });
    }

    await armClient.databases.beginCreateOrUpdateAndWait(info.resourceGroupName, serverName, dbName, {
        location: info.location,
        sku: {
            name: 'GP_S_Gen5_1',
            tier: 'GeneralPurpose',
        },
    });

    const poolConnection = await createPoolConnnectionWithRetry(info);
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

async function createPoolConnnection(info: ResourceInfo): Promise<sql.ConnectionPool> {
    const serverName = getSqlAccountName(info);
    return sql.connect({
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
}

async function createPoolConnnectionWithRetry(info: ResourceInfo): Promise<sql.ConnectionPool> {
    const retries = 5;
    return retry(
        async (currentAttempt: number) => {
            if (currentAttempt > 1) {
                console.log(
                    `${new Date().toISOString()}: Retrying sql connect. Attempt ${currentAttempt}/${retries + 1}`
                );
            }
            return createPoolConnnection(info);
        },
        {
            retries: retries,
            minTimeout: 5 * 1000,
            onFailedAttempt: (error) => {
                if (!/ip address/i.test(error?.message || '')) {
                    throw error; // abort for an unrecognized error
                } else if (error.retriesLeft > 0) {
                    console.log(`Warning: Failed to sql connect with error "${error.message}"`);
                }
            },
        }
    );
}

export async function getSqlConnectionString(info: ResourceInfo): Promise<string> {
    const serverName = getSqlAccountName(info);
    return `Server=${serverName}.database.windows.net; Authentication=Active Directory Service Principal; Encrypt=True; Database=${dbName}; User Id=${info.clientId}; Password=${info.secret}`;
}
