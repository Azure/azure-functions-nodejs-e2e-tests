// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { isDefined } from './nonNull';

export function validateEnvVar(name: string): string {
    const value = process.env[name];
    if (!isDefined(value)) {
        throw new Error(`You must set the environment variable "${name}".`);
    }
    return value;
}
