// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import crypto from 'crypto';

export function getRandomTestData(): string {
    // This should start with non-numeric data to prevent this bug from causing a test failure
    // https://github.com/Azure/azure-functions-nodejs-library/issues/90
    return `testData${getRandomHexString()}`;
}

export function getRandomHexString(length = 10): string {
    const buffer: Buffer = crypto.randomBytes(Math.ceil(length / 2));
    return buffer.toString('hex').slice(0, length);
}
