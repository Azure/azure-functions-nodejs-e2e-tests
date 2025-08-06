// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

// import mysql from 'mysql2/promise';
import * as sql from 'mssql';
import { sqlConnectionString } from '../connectionStrings';
import { Sql } from '../../constants';

export async function createPoolConnnection(): Promise<sql.ConnectionPool> {
    // const password = process.env.SA_PASSWORD;
    // if (!password || password.trim() === '') {
    //     throw new Error('Missing required environment variable: SA_PASSWORD');
    // }

    // const config = {
    //     user: 'sa',
    //     password: password,
    //     server: 'localhost',
    //     port: 15433,
    //     database: 'master',
    //     options: {
    //         encrypt: false, // set to true if connecting to Azure SQL
    //         trustServerCertificate: true,
    //     }
    // };

    if (!sqlConnectionString || sqlConnectionString.trim() === '') {
        throw new Error('Missing required environment variable: SqlConnection');
    }
    
    const poolConnection = await sql.connect(sqlConnectionString);
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

    return poolConnection;
}

// export async function createPoolConnnection(connectionString: string): Promise<sql.ConnectionPool> {
//     const retries = 5;
//     return retry(
//         async (currentAttempt: number) => {
//             if (currentAttempt > 1) {
//                 console.log(
//                     `${new Date().toISOString()}: Retrying sql connect. Attempt ${currentAttempt}/${retries + 1}`
//                 );
//             }
//             return sql.connect(connectionString);
//         },
//         {
//             retries: retries,
//             minTimeout: 5 * 1000,
//             onFailedAttempt: (error) => {
//                 if (!/ip address/i.test(error?.message || '')) {
//                     throw error; // abort for an unrecognized error
//                 } else if (error.retriesLeft > 0) {
//                     console.log(`Warning: Failed to sql connect with error "${error.message}"`);
//                 }
//             },
//         }
//     );
// }
