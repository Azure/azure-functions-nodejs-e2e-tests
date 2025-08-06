// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

// import mysql from 'mysql2/promise';
import * as sql from 'mssql';
// import { Sql } from '../../constants';

export async function runSqlSetupQueries(): Promise<sql.ConnectionPool> {
    const password = process.env.SA_PASSWORD;
    if (!password || password.trim() === '') {
        throw new Error('Missing required environment variable: SA_PASSWORD');
    }

    const config = {
        user: 'sa',
        password: password,
        server: 'localhost',
        port: 15433,
        database: 'master',
        options: {
            encrypt: false, // set to true if connecting to Azure SQL
            trustServerCertificate: true,
        }
    };

    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT name FROM sys.databases');
    console.log('Databases:', result.recordset);

    return pool;

    // const poolConnection = await createPoolConnnection();

    // try {
    //     await poolConnection
    //         .request()
    //         .query(`ALTER DATABASE ${dbName} SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);`);

    //     for (const table of [sqlTriggerTable, sqlNonTriggerTable]) {
    //         await poolConnection
    //             .request()
    //             .query(
    //                 `CREATE TABLE dbo.${table} ([id] UNIQUEIDENTIFIER PRIMARY KEY, [testData] NVARCHAR(200) NOT NULL);`
    //             );
    //         await poolConnection.request().query(`ALTER TABLE dbo.${table} ENABLE CHANGE_TRACKING;`);
    //     }
    // } finally {
    //     await poolConnection.close();
    // }
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
