// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import mysql from 'mysql2/promise';
import retry from 'p-retry';

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
    const poolConnection = await createPoolConnnection();

    try {
        await poolConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await poolConnection.changeUser({ database: dbName });

        // for (const table of [sqlTriggerTable, sqlNonTriggerTable]) {
        //   await poolConnection.query(`
        //     CREATE TABLE IF NOT EXISTS \`${table}_changes\` (
        //       id CHAR(36),
        //       action ENUM('INSERT', 'UPDATE', 'DELETE'),
        //       changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //     );
        //   `);

        //   await poolConnection.query(`
        //     CREATE TRIGGER IF NOT EXISTS ${table}_after_insert
        //     AFTER INSERT ON \`${table}\`
        //     FOR EACH ROW
        //     INSERT INTO \`${table}_changes\` (id, action) VALUES (NEW.id, 'INSERT');
        //   `);
        // }
    } finally {
        await poolConnection.end();
    }
}

export async function createPoolConnnection(): Promise<mysql.Connection> {
    return mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'testdb',
      port: 3307
  });
}