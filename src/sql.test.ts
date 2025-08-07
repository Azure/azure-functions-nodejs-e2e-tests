// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { v4 as uuid } from 'uuid';
import { getFuncUrl } from './constants';
import { isOldConfig, waitForOutput } from './global.test';
import { getRandomTestData } from './utils/getRandomTestData';
// import { runSqlSetupQueries } from './utils/sql/setupSql';
import { Sql } from './constants';
import { ConnectionPool } from 'mssql';

describe('sql', () => {
    let poolConnection: ConnectionPool | undefined;
    before(async function (this: Mocha.Context) {
        if (isOldConfig) {
            this.skip();
        }
    });

    after(async () => {
        await poolConnection?.close();
    });

    type SqlItem = { id: string; testData: string };

    it('trigger', async () => {
        const id = uuid();
        const testData = getRandomTestData();

        if (!poolConnection) {
            throw new Error('SQL connection pool is not initialized');
        }

        // trigger by insert
        await poolConnection!.request().query(`INSERT INTO ${Sql.sqlTriggerTable} VALUES ('${id}', '${testData}');`);
        await waitForOutput(`sqlTrigger processed 1 changes`);
        await waitForOutput(`sqlTrigger was triggered by operation "insert" for "${JSON.stringify({ id, testData })}"`);

        // trigger by update
        await poolConnection!
            .request()
            .query(`UPDATE ${Sql.sqlTriggerTable} SET testData='${testData}-updated' WHERE id='${id}';`);
        await waitForOutput(`sqlTrigger processed 1 changes`);
        await waitForOutput(
            `sqlTrigger was triggered by operation "update" for "${JSON.stringify({
                id,
                testData: `${testData}-updated`,
            })}"`
        );

        // trigger by delete
        await poolConnection!.request().query(`DELETE FROM ${Sql.sqlTriggerTable} WHERE id='${id}';`);
        await waitForOutput(`sqlTrigger processed 1 changes`);
        await waitForOutput(`sqlTrigger was triggered by operation "delete" for "${JSON.stringify({ id })}"`);
    });

    it('input and output', async () => {
        const outputUrl = getFuncUrl('httpTriggerSqlOutput');

        const id = uuid();
        const items: SqlItem[] = [
            {
                id,
                testData: getRandomTestData(),
            },
        ];
        const responseOut = await fetch(outputUrl, { method: 'POST', body: JSON.stringify(items) });
        expect(responseOut.status).to.equal(201);
        await waitForOutput(`httpTriggerSqlOutput was triggered`);

        const inputUrl = getFuncUrl('httpTriggerSqlInput');
        const responseIn = await fetch(`${inputUrl}?id=${id}`, { method: 'GET' });
        expect(responseIn.status).to.equal(200);
        const result = await responseIn.json();
        expect(result).to.deep.equal(items);
        await waitForOutput(`httpTriggerSqlInput was triggered`);
    });
});