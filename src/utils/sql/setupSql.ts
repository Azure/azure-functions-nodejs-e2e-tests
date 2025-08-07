// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

// import mysql from 'mysql2/promise';
import * as sql from 'mssql';
import { sqlConnectionString, sqlTestConnectionString } from '../connectionStrings';
import { Sql } from '../../constants';

export async function runSqlSetupQueries() {
    let pool = await sql.connect(sqlConnectionString);
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

export async function createPoolConnnection() {
    return await sql.connect(sqlTestConnectionString);
}
