// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as sql from 'mssql';
import retry from 'p-retry';
import { sqlConnectionString, sqlTestConnectionString } from '../connectionStrings';
import { Sql } from '../../constants';

export async function runSqlSetupQueries() {
    // STEP 1: Create DB if not exists
    let pool = await createPoolConnnection(sqlConnectionString);
    await pool.request().query(`
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${Sql.dbName}')
        BEGIN
            CREATE DATABASE [${Sql.dbName}];
        END
    `);

    // STEP 2: Retry ALTER DATABASE (change_tracking)
    try {
        await retry(async (currentAttempt) => {
            if (currentAttempt > 1) {
                console.log(
                    `${new Date().toISOString()}: Retrying ALTER DATABASE. Attempt ${currentAttempt}`
                );
            }
            await pool.request().query(`
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.change_tracking_databases
                    WHERE database_id = DB_ID('${Sql.dbName}')
                )
                BEGIN
                    ALTER DATABASE [${Sql.dbName}]
                    SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);
                END
            `);
        }, {
            retries: 5,
            minTimeout: 5000
        });
    } finally {
        await pool.close();
    }

    // STEP 3: Create tables and enable tracking
    pool = await createPoolConnnection(sqlTestConnectionString);
    try {
        for (const table of [Sql.sqlTriggerTable, Sql.sqlNonTriggerTable]) {
            await pool.request().query(`
                IF OBJECT_ID('dbo.${table}', 'U') IS NULL
                BEGIN
                    CREATE TABLE dbo.${table} (
                        id UNIQUEIDENTIFIER PRIMARY KEY,
                        testData NVARCHAR(200) NOT NULL
                    );
                    ALTER TABLE dbo.${table} ENABLE CHANGE_TRACKING;
                END
            `);
        }
    } finally {
        await pool.close();
    }
}

export async function createPoolConnnection(connectionString: string): Promise<sql.ConnectionPool> {
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