// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import fs from 'fs/promises';
import path from 'path';
import { combinedFolder, oldConfigSuffix } from './constants';

async function createCombinedApps(): Promise<void> {
    const appRoot = path.join(__dirname, '..', 'app');
    for (const model of ['v3', 'v4']) {
        const modelRoot = path.join(appRoot, model);
        const oldConfigRoot = path.join(appRoot, model + oldConfigSuffix);
        const combinedRoot = path.join(appRoot, combinedFolder, model + oldConfigSuffix);
        await fs.cp(modelRoot, combinedRoot, {
            recursive: true,
            filter: (source) => {
                const foldersToExclude = ['dist', 'node_modules'];
                return !foldersToExclude.find((f) => source.includes(f));
            },
        });
        await fs.cp(oldConfigRoot, combinedRoot, { recursive: true });
    }
}

void createCombinedApps();
