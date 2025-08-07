// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import globby from 'globby';
import Mocha from 'mocha';
import path from 'path';
import { defaultTimeout } from './constants';
import { getModelArg, getOldConfigArg, getTestFileFilter } from './getModelArg';

export async function run(): Promise<void> {
    try {
        const oldConfigSuffix = getOldConfigArg() ? '_oldConfig' : '';
        const fileName = `${process.platform}_model-${getModelArg()}_Node-${process.version}${oldConfigSuffix}.xml`;
        const options: Mocha.MochaOptions = {
            color: true,
            timeout: defaultTimeout,
            reporter: 'mocha-multi-reporters',
            reporterOptions: {
                reporterEnabled: 'spec, mocha-junit-reporter',
                mochaJunitReporterReporterOptions: {
                    mochaFile: path.resolve(__dirname, '..', 'e2e-test-results', fileName),
                },
            },
        };

        addEnvVarsToMochaOptions(options);

        const mocha = new Mocha(options);

        let files: string[] = await globby('**/*.test.js', { cwd: __dirname });
        const { only, exclude } = getTestFileFilter();
        if (only) {
            files = files.filter(f => f.endsWith(only));
        } else if (exclude) {
            files = files.filter(f => !f.endsWith(exclude));
        }

        files.forEach((f) => mocha.addFile(path.resolve(__dirname, f)));
        mocha.addFile(path.resolve(__dirname, 'global.test.js'));

        const failures = await new Promise<number>((resolve) => mocha.run(resolve));
        if (failures > 0) {
            throw new Error(`${failures} tests failed.`);
        }
        console.log('Test run succeeded');
        process.exit(0);
    } catch (err) {
        console.error(err);
        console.error('Test run failed');
        process.exit(1);
    }
}

function addEnvVarsToMochaOptions(options: Mocha.MochaOptions): void {
    for (const envVar of Object.keys(process.env)) {
        const match: RegExpMatchArray | null = envVar.match(/^mocha_(.+)/i);
        if (match) {
            const [, option] = match;
            let value: string | number = process.env[envVar] || '';
            if (typeof value === 'string' && !isNaN(parseInt(value))) {
                value = parseInt(value);
            }
            (<any>options)[option] = value;
        }
    }
}

void run();
