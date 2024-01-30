// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as crypto from 'crypto';
import { Readable } from 'stream';
import { delay } from './delay';

export function createRandomStream(lengthInMb: number): Readable {
    const stream = new Readable();
    stream._read = () => {};
    setTimeout(() => {
        void sendRandomData(stream, lengthInMb);
    }, 5);
    return stream;
}

async function sendRandomData(stream: Readable, lengthInMb: number): Promise<void> {
    const maxChunkSize = oneMb;
    let remainingBytes = convertMbToB(lengthInMb);
    do {
        if (stream.readableLength > maxChunkSize) {
            await delay(5);
        } else {
            const chunkSize = Math.min(maxChunkSize, remainingBytes);
            stream.push(crypto.randomBytes(chunkSize));
            remainingBytes -= chunkSize;
        }
    } while (remainingBytes > 0);
    stream.push(null);
}

export async function receiveStreamWithProgress(stream: {
    [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;
}): Promise<number> {
    let bytesReceived = 0;
    const logInterval = 500;
    let nextLogTime = Date.now();
    for await (const chunk of stream) {
        if (Date.now() > nextLogTime) {
            nextLogTime = Date.now() + logInterval;
            console.log(`Progress: ${convertBToMb(bytesReceived)}mb`);
        }

        bytesReceived += chunk.length;
    }
    return bytesReceived;
}

const oneMb = 1024 * 1024;

export function convertMbToB(mb: number): number {
    return mb * oneMb;
}

function convertBToMb(bytes: number) {
    return Math.round(bytes / oneMb);
}
