// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as sql from 'mssql';
import retry from 'p-retry';
import { sqlConnectionString } from '../connectionStrings';
import { Sql } from '../../constants';

export async function runSqlSetupQueries() {
    let pool = await createPoolConnnection(sqlConnectionString);
    try {
        await pool
            .request()
            .query(`IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${Sql.dbName}')
                    BEGIN
                        CREATE DATABASE [${Sql.dbName}];
                    END`);
        await pool
            .request()
            .query(`ALTER DATABASE ${Sql.dbName} SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);`);
    } finally {
        await pool.close();
    }

    // pool = await sql.connect(sqlTestConnectionString);

    // try {
    //     for (const table of [Sql.sqlTriggerTable, Sql.sqlNonTriggerTable]) {
    //         await pool
    //             .request()
    //             .query(
    //                 `CREATE TABLE dbo.${table} ([id] UNIQUEIDENTIFIER PRIMARY KEY, [testData] NVARCHAR(200) NOT NULL);`
    //             );
    //         await pool.request().query(`ALTER TABLE dbo.${table} ENABLE CHANGE_TRACKING;`);
    //     }
    // } finally {
    //     await pool.close();
    // }
}

async function createPoolConnnection(connectionString: string): Promise<sql.ConnectionPool> {
    const retries = 5;
    return retry(
        async (currentAttempt: number) => {
            if (currentAttempt > 1) {
                console.log(
                    `${new Date().toISOString()}: Retrying sql connect. Attempt ${currentAttempt}/${retries + 1}`
                );
            }
            return sql.connect(connectionString);
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