// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { default as fetch } from 'node-fetch';
import { v4 as uuid } from 'uuid';
import { getFuncUrl } from './constants';
import { isOldBundle, waitForOutput } from './global.test';
import { getRandomTestData } from './utils/getRandomTestData';

describe('sql', () => {
    before(function (this: Mocha.Context) {
        if (isOldBundle) {
            this.skip();
        }
    });

    type SqlItem = { id: string; testData: string };

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
