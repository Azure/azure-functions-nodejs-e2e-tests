// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import Agent from 'agentkeepalive';
import { expect } from 'chai';
import { encode } from 'iconv-lite';
// Node.js core added support for fetch in v18, but while we're testing versions <18 we'll use "node-fetch"
import { default as fetch, HeadersInit } from 'node-fetch';
import { Readable } from 'stream';
import util from 'util';
import { getFuncUrl } from './constants';
import { funcCliSettings, isOldConfig, model } from './global.test';
import { addRandomAsyncOrSyncDelay, getRandomTestData } from './utils/getRandomTestData';
import { convertMbToB, createRandomStream, receiveStreamWithProgress } from './utils/streamHttp';

const helloWorldUrl = getFuncUrl('helloWorld');
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
    afterEach(() => {
        funcCliSettings.hideOutput = false;
    });

    it('hello world', async () => {
        const response = await fetch(helloWorldUrl);
        const body = await response.text();
        expect(body).to.equal('Hello, world!');
        expect(response.status).to.equal(200);
    });

    it('hello world name in body', async () => {
        const response = await fetch(helloWorldUrl, { method: 'POST', body: 'testName' });
        const body = await response.text();
        expect(body).to.equal('Hello, testName!');
        expect(response.status).to.equal(200);
    });

    it('hello world name in query', async () => {
        const response = await fetch(`${helloWorldUrl}?name=testName`);
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
        if (isOldConfig || model === 'v3') {
            expect(cookies).to.equal(
                'mycookie=myvalue; max-age=200000; path=/, mycookie2=myvalue; max-age=200000; path=/, mycookie3-expires=myvalue3-expires; max-age=0; path=/, mycookie4-samesite-lax=myvalue; path=/; samesite=lax, mycookie5-samesite-strict=myvalue; path=/; samesite=strict'
            );
        } else {
            expect(cookies?.toLowerCase()).to.equal(
                'mycookie=myvalue; max-age=200000, mycookie2=myvalue; max-age=200000; path=/, mycookie3-expires=myvalue3-expires; max-age=0, mycookie4-samesite-lax=myvalue; samesite=lax, mycookie5-samesite-strict=myvalue; samesite=strict'
            );
        }
    });

    // Use a connection pool to avoid flaky test failures due to various connection limits (Mac in particular seems to have a low limit)
    // NOTE: The node-fetch package has a bug starting in 2.6.8 related to keep alive agents, so we have to use 2.6.7
    // https://github.com/node-fetch/node-fetch/issues/1767
    const keepaliveAgent = new Agent({ maxSockets: 128, maxFreeSockets: 64 });

    async function validateIndividualRequest(url: string): Promise<void> {
        const data = getRandomTestData();
        await addRandomAsyncOrSyncDelay();
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            timeout: 40 * 1000,
            agent: keepaliveAgent,
        });
        const body = await response.text();
        expect(body).to.equal(`Hello, ${data}!`);
    }

    it('http trigger concurrent requests', async function (this: Mocha.Context) {
        funcCliSettings.hideOutput = true; // because this test is too noisy
        const url = getFuncUrl('httpTriggerRandomDelay');

        const reqs: Promise<void>[] = [];
        const numReqs = 1024;
        for (let i = 0; i < numReqs; i++) {
            reqs.push(validateIndividualRequest(url));
        }
        let countFailed = 0;
        let countTimedOut = 0;
        let countSucceeded = 0;
        const results = await Promise.allSettled(reqs);
        for (const result of results) {
            if (result.status === 'rejected') {
                if (typeof result.reason?.message === 'string' && /timeout/i.test(result.reason.message)) {
                    countTimedOut += 1;
                } else {
                    console.error(result.reason);
                    countFailed += 1;
                }
            } else {
                countSucceeded += 1;
            }
        }
        if (countFailed > 0 || countTimedOut > 0) {
            throw new Error(
                `${countFailed} request(s) failed, ${countTimedOut} timed out, ${countSucceeded} succeeded`
            );
        }
    });

    describe('stream', () => {
        before(function (this: Mocha.Context) {
            if (isOldConfig || model === 'v3') {
                this.skip();
            }
        });

        it('hello world stream', async () => {
            const body = new Readable();
            body._read = () => {};
            body.push('testName-chunked');
            body.push(null);

            const response = await fetch(helloWorldUrl, { method: 'POST', body });
            const resBody = await response.text();
            expect(resBody).to.equal('Hello, testName-chunked!');
            expect(response.status).to.equal(200);
        });

        for (const lengthInMb of [32, 128, 512, 2048]) {
            it(`send stream ${lengthInMb}mb`, async () => {
                const funcUrl = getFuncUrl('httpTriggerReceiveStream');
                const randomStream = createRandomStream(lengthInMb);
                const response = await fetch(funcUrl, { method: 'POST', body: randomStream });
                const resBody = await response.text();
                expect(resBody).to.equal(`Bytes received: ${convertMbToB(lengthInMb)}`);
                expect(response.status).to.equal(200);
            });

            it(`receive stream ${lengthInMb}mb`, async () => {
                const funcUrl = getFuncUrl('httpTriggerSendStream');
                const response = await fetch(`${funcUrl}?lengthInMb=${lengthInMb}`, { method: 'GET' });

                const bytesReceived = await receiveStreamWithProgress(response.body);
                expect(bytesReceived).to.equal(convertMbToB(lengthInMb));
                expect(response.status).to.equal(200);
            });
        }
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
