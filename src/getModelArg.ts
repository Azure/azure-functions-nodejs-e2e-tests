// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import parseArgs from 'minimist';

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

export function getOldConfigArg(): boolean {
    const flag = 'oldConfig';
    const args = parseArgs(process.argv.slice(2), { boolean: flag });
    return args[flag];
}

export function getTestFileFilter(): { only?: string; exclude?: string } {
    const args = parseArgs(process.argv.slice(2));
    const only = typeof args.only === 'string' ? args.only : undefined;
    const exclude = typeof args.exclude === 'string' ? args.exclude : undefined;
    return { only, exclude };
}
