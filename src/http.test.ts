// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { encode } from 'iconv-lite';
import * as util from 'util';
import { model } from './global.test';

function getFuncUrl(functionName: string): string {
    return `http://localhost:7071/api/${functionName}`;
}

const helloWorld1Url = getFuncUrl('helloWorld1');
const httpRawBodyUrl = getFuncUrl('httpRawBody');

function getContentTypeHeaders(contentType: string): HeadersInit {
    return {
        'content-type': contentType,
    };
}
const applicationJsonHeaders = getContentTypeHeaders('application/json');
const octetStreamHeaders = getContentTypeHeaders('application/octet-stream');
const multipartFormHeaders = getContentTypeHeaders('multipart/form');
const textPlainHeaders = getContentTypeHeaders('text/plain');

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

    it('Cookies', async () => {
        const response = await fetch(getFuncUrl('httpCookies'));
        const body = await response.text();
        expect(body).to.equal('');
        expect(response.status).to.equal(200);
        const cookies = response.headers.get('Set-Cookie');
        expect(cookies).to.equal(
            'mycookie=myvalue; max-age=200000; path=/, mycookie2=myvalue; max-age=200000; path=/, mycookie3-expires=myvalue3-expires; max-age=0; path=/, mycookie4-samesite-lax=myvalue; path=/; samesite=lax, mycookie5-samesite-strict=myvalue; path=/; samesite=strict'
        );
    });

    describe('v3 only', () => {
        before(function (this: Mocha.Context) {
            if (model !== 'v3') {
                this.skip();
            }
        });

        it('Json body', async () => {
            for (const headers of [applicationJsonHeaders, textPlainHeaders]) {
                const content = '{ "a": 1 }';
                const response = await fetch(httpRawBodyUrl, {
                    method: 'POST',
                    body: content,
                    headers,
                });
                const body = await response.json();
                expect(body.body, 'body').to.deep.equal(JSON.parse(content));
                expect(body.rawBody, 'rawBody').to.equal(content);
                expect(body.bufferBody, 'bufferBody').to.equal(util.format(Buffer.from(content)));
                expect(response.status).to.equal(200);
            }
        });

        it('Json body invalid', async () => {
            const content = '{ "a": 1, "b": }';
            const response = await fetch(httpRawBodyUrl, {
                method: 'POST',
                body: content,
                headers: applicationJsonHeaders,
            });
            const body = await response.json();
            expect(body.body, 'body').to.equal(content);
            expect(body.rawBody, 'rawBody').to.equal(content);
            expect(body.bufferBody, 'bufferBody').to.equal(util.format(Buffer.from(content)));
            expect(response.status).to.equal(200);
        });

        it('Json body stream/multipart type', async () => {
            for (const headers of [
                octetStreamHeaders,
                multipartFormHeaders,
                getContentTypeHeaders('multipart/whatever'),
            ]) {
                const content = '{ "a": 1 }';
                const response = await fetch(httpRawBodyUrl, {
                    method: 'POST',
                    body: content,
                    headers,
                });
                const body = await response.json();
                const expectedBuffer = util.format(Buffer.from(content));
                expect(body.body, 'body').to.equal(expectedBuffer);
                expect(body.rawBody, 'rawBody').to.deep.equal(content);
                expect(body.bufferBody, 'bufferBody').to.equal(expectedBuffer);
                expect(response.status).to.equal(200);
            }
        });

        it('Plain text', async () => {
            for (const encoding of ['utf16be', 'utf16le', 'utf32le', 'utf8', 'utf32be']) {
                const buffer = encode('abc', encoding);
                const response = await fetch(httpRawBodyUrl, {
                    method: 'POST',
                    body: buffer,
                    headers: textPlainHeaders,
                });
                const body = await response.json();
                expect(body.body, 'body').to.equal(buffer.toString());
                expect(body.rawBody, 'rawBody').to.equal(buffer.toString());
                expect(body.bufferBody, 'bufferBody').to.equal(util.format(buffer));
                expect(response.status).to.equal(200);
            }
        });
    });
});
