// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as parseArgs from 'minimist';

export type Model = 'v3' | 'v4';

export function getModelArg(): Model {
    const args = parseArgs(process.argv.slice(2));
    const modelArg: string = args.model || args.m;
    if (modelArg === 'v3' || modelArg === 'v4') {
        return modelArg;
    } else {
        throw new Error('You must pass in the model argument with "--model" or "-m". Valid values are "v3" or "v4".');
    }
}
