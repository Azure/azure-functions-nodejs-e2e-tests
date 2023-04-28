// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';

function getFuncUrl(functionName: string): string {
    return `http://localhost:7071/api/${functionName}`;
}

const helloWorld1Url = getFuncUrl('helloWorld1');

describe('http', () => {
    it('hello world', async () => {
        const response = await fetch(helloWorld1Url);
        const body = await response.text();
        expect(body).to.equal('Hello, world!');
        expect(response.status).to.equal(200);
    });

    it('hello world name in body', async () => {
        const response = await fetch(helloWorld1Url, { method: 'POST', body: 'testName' });
        const body = await response.text();
        expect(body).to.equal('Hello, testName!');
        expect(response.status).to.equal(200);
    });

    it('hello world name in query', async () => {
        const response = await fetch(`${helloWorld1Url}?name=testName`);
        const body = await response.text();
        expect(body).to.equal('Hello, testName!');
        expect(response.status).to.equal(200);
    });

    it('No function', async () => {
        const response = await fetch(getFuncUrl('doesntExist'));
        const body = await response.text();
        expect(body).to.equal('');
        expect(response.status).to.equal(404);
    });
});
