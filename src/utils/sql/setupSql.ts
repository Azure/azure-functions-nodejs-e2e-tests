// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import mysql from 'mysql2/promise';
// import retry from 'p-retry';

/**
 * Various helpful sql docs:
 * https://github.com/Azure/azure-functions-sql-extension/blob/main/docs/GeneralSetup.md
 * https://github.com/Azure/azure-functions-sql-extension/blob/main/docs/SetupGuide_Javascript.md
 * https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs
 * https://learn.microsoft.com/en-us/azure/azure-sql/database/azure-sql-javascript-mssql-quickstart
 */

export const dbName = 'e2eTestDB';
export const sqlTriggerTable = 'e2eSqlTriggerTable';
export const sqlNonTriggerTable = 'e2eSqlNonTriggerTable';
export const sqlSecretName = 'e2eSqlSecret';

/**
 * create tables and enable change tracking for trigger
 */
export async function runSqlSetupQueries() {
    // const connectionString = await getSqlConnectionString();
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: 'password',
        database: 'testdb',
    });
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS person (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `;
    await pool.query(createTableQuery)
    console.log('Table "person" created or already exists.');
    pool.end();

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

// export async function getSqlConnectionString(): Promise<string> {
//     const server = 'localhost'; // or 'sqlserver' if running in another container
//     const port = 1433;
//     const user = 'sa';
//     const password = 'thisPasswordDoesntMatter@1475';
//     const database = dbName;

//     return `Server=${server},${port};Database=${database};User Id=${user};Password=${password};Encrypt=false;TrustServerCertificate=true;`;
// }
