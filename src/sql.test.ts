// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { ConnectionPool } from 'mssql';
import { default as fetch } from 'node-fetch';
import { v4 as uuid } from 'uuid';
import { getFuncUrl, jsonContentTypeHeaders, Sql } from './constants';
import { isOldConfig, waitForOutput } from './global.test';
import { sqlTestConnectionString } from './utils/connectionStrings';
import { getRandomTestData } from './utils/getRandomTestData';
import { createPoolConnnection } from './utils/sql/setupSql';

describe('sql', () => {
    let poolConnection: ConnectionPool | undefined;
    before(async function (this: Mocha.Context) {
        if (isOldConfig) {
            this.skip();
        }

        poolConnection = await createPoolConnnection(sqlTestConnectionString);
    });

    after(async () => {
        await poolConnection?.close();
    });

    type SqlItem = { id: string; testData: string };

    it('trigger', async () => {
        const id = uuid();
        const testData = getRandomTestData();

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
        const responseOut = await fetch(outputUrl, {
            method: 'POST',
            headers: jsonContentTypeHeaders,
            body: JSON.stringify(items),
        });
        expect(responseOut.status).to.equal(201);
        await waitForOutput(`httpTriggerSqlOutput was triggered`);

        const responseIn = await fetch(getFuncUrl('httpTriggerSqlInput', { id }), { method: 'GET' });
        expect(responseIn.status).to.equal(200);
        const result = await responseIn.json();
        expect(result).to.deep.equal(items);
        await waitForOutput(`httpTriggerSqlInput was triggered`);
    });

    it('input and output reject invalid requests', async () => {
        const invalidWriteResponse = await fetch(getFuncUrl('httpTriggerSqlOutput'), {
            method: 'POST',
            headers: jsonContentTypeHeaders,
            body: JSON.stringify([{ id: uuid() }]),
        });
        expect(invalidWriteResponse.status).to.equal(400);

        const invalidReadResponse = await fetch(getFuncUrl('httpTriggerSqlInput'), { method: 'GET' });
        expect(invalidReadResponse.status).to.equal(400);

        const missingRowResponse = await fetch(getFuncUrl('httpTriggerSqlInput', { id: uuid() }), { method: 'GET' });
        expect(missingRowResponse.status).to.equal(404);
    });
});
