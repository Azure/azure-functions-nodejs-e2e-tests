// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

// import mysql from 'mysql2/promise';
import * as sql from 'mssql';
import { sqlConnectionString } from '../connectionStrings';
import { Sql } from '../../constants';

export async function runSqlSetupQueries() {
    const poolConnection = await sql.connect(sqlConnectionString);
    try {
        await poolConnection
            .request()
            .query(`ALTER DATABASE ${Sql.dbName} SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);`);

        for (const table of [Sql.sqlTriggerTable, Sql.sqlNonTriggerTable]) {
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

export async function createPoolConnnection() {
    return await sql.connect(sqlConnectionString);
}
