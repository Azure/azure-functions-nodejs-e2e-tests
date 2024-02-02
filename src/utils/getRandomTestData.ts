// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as crypto from 'crypto';
import { delay, delaySync } from './delay';

export function getRandomTestData(): string {
    // This should start with non-numeric data to prevent this bug from causing a test failure
    // https://github.com/Azure/azure-functions-nodejs-library/issues/90
    return `testData${getRandomHexString()}`;
}

export function getRandomHexString(length = 10): string {
    const buffer: Buffer = crypto.randomBytes(Math.ceil(length / 2));
    return buffer.toString('hex').slice(0, length);
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomBoolean(percentTrue: number): boolean {
    return Math.random() * 100 > percentTrue;
}

export async function addRandomAsyncOrSyncDelay(): Promise<void> {
    if (getRandomBoolean(95)) {
        await delay(getRandomInt(0, 250));
    } else {
        delaySync(getRandomInt(0, 10));
    }
}
