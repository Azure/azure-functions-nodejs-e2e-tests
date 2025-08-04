// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import mysql from 'mysql2/promise';
import { Sql } from '../../constants';

export async function runSqlSetupQueries(): Promise<mysql.Pool> {
    // const connectionString = await getSqlConnectionString();
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: 'password',
        database: Sql.dbName,
    });

    for (const table of [Sql.sqlTriggerTable, Sql.sqlNonTriggerTable]) {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${table} (
                id CHAR(36) PRIMARY KEY, 
                testData VARCHAR(200) NOT NULL, 
                az_func_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
    }

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
