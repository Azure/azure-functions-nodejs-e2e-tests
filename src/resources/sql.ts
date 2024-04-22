// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { SqlManagementClient } from '@azure/arm-sql';
import * as sql from 'mssql';
import { default as fetch } from 'node-fetch';
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
export const sqlTriggerTable = 'e2eSqlTriggerTable';
export const sqlNonTriggerTable = 'e2eSqlNonTriggerTable';

export async function createSql(info: ResourceInfo): Promise<void> {
    const serverName = getSqlAccountName(info);
    const armClient = new SqlManagementClient(info.creds, info.subscriptionId);
    await armClient.servers.beginCreateOrUpdateAndWait(info.resourceGroupName, serverName, {
        location: info.location,
        administrators: {
            administratorType: 'ActiveDirectory',
            principalType: 'User',
            sid: info.userId,
            azureADOnlyAuthentication: true,
            login: info.userName,
        },
    });

    const [startIpAddress, endIpAddress] = await getPublicIpAddress();
    console.log(`Adding ip address "${startIpAddress}"-"${endIpAddress}" to sql firewall rule.`);
    await armClient.firewallRules.createOrUpdate(info.resourceGroupName, serverName, 'e2eTestFirewall', {
        startIpAddress,
        endIpAddress,
    });
    await armClient.databases.beginCreateOrUpdateAndWait(info.resourceGroupName, serverName, dbName, {
        location: info.location,
        sku: {
            name: 'GP_S_Gen5_1',
            tier: 'GeneralPurpose',
        },
    });

    await runSetupQueries(info);
}

async function getPublicIpAddress(): Promise<[string, string]> {
    const response = await fetch('https://api.ipify.org/');
    const ip = await response.text();
    // Use a range because the host ID part of the address can change mid-run in hosted agents
    const hostIdRegex = /\.[0-9]+$/;
    const start = ip.replace(hostIdRegex, '.0');
    const end = ip.replace(hostIdRegex, '.255');
    return [start, end];
}

/**
 * create tables and enable change tracking for trigger
 */
async function runSetupQueries(info: ResourceInfo) {
    const poolConnection = await createPoolConnnection(getSqlConnectionConfig(info));

    try {
        await poolConnection
            .request()
            .query(`ALTER DATABASE ${dbName} SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);`);

        for (const table of [sqlTriggerTable, sqlNonTriggerTable]) {
            await poolConnection
                .request()
                .query(
                    `CREATE TABLE dbo.${table} ([id] UNIQUEIDENTIFIER PRIMARY KEY, [testData] NVARCHAR(200) NOT NULL);`
                );
            await poolConnection.request().query(`ALTER TABLE dbo.${table} ENABLE CHANGE_TRACKING;`);
        }
    } finally {
        await poolConnection.close();
    }
}

export async function createPoolConnnection(config: sql.config): Promise<sql.ConnectionPool> {
    const retries = 5;
    return retry(
        async (currentAttempt: number) => {
            if (currentAttempt > 1) {
                console.log(
                    `${new Date().toISOString()}: Retrying sql connect. Attempt ${currentAttempt}/${retries + 1}`
                );
            }
            return sql.connect(config);
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
    return `Server=${serverName}.database.windows.net; Authentication=Active Directory Default; Encrypt=True; Database=${dbName};`;
}

/**
 * connection string support in mssql npm package doesn't work, have to use config
 * https://github.com/tediousjs/node-mssql/issues/1400
 */
export function getSqlConnectionConfig(info: ResourceInfo): sql.config {
    const serverName = getSqlAccountName(info);
    return {
        server: `${serverName}.database.windows.net`,
        database: dbName,
        port: 1433,
        authentication: {
            type: 'azure-active-directory-default',
            options: {},
        },
        options: {
            encrypt: true,
        },
    };
}
