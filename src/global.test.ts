// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import cp from 'child_process';
import * as fs from 'fs/promises';
import path from 'path';
import semver from 'semver';
import { combinedFolder, defaultTimeout, EnvVarNames, oldConfigSuffix } from './constants';
import { getModelArg, getOldConfigArg, Model } from './getModelArg';
import {
    cosmosDBConnectionString,
    eventHubConnectionString,
    initializeConnectionStrings,
    serviceBusConnectionString,
    sqlConnectionString,
    storageConnectionString,
} from './resources/connectionStrings';
import { delay } from './utils/delay';
import findProcess = require('find-process');

let perTestFuncOutput = '';
let fullFuncOutput = '';
export let model: Model | undefined;
export let isOldConfig: boolean;
let childProc: cp.ChildProcess | undefined;
let testsDone = false;

interface FuncCliSettings {
    hideOutput?: boolean;
}

export const funcCliSettings: FuncCliSettings = {};

before(async function (this: Mocha.Context): Promise<void> {
    model = getModelArg();
    if (model === 'v4' && semver.lt(process.versions.node, '18.0.0')) {
        this.skip();
    }

    await killFuncProc();

    await initializeConnectionStrings();

    isOldConfig = getOldConfigArg();
    const appPath = isOldConfig
        ? path.join(__dirname, '..', 'app', combinedFolder, model + oldConfigSuffix)
        : path.join(__dirname, '..', 'app', model);

    await startFuncProcess(appPath);
    await waitForOutput('Host lock lease acquired by instance ID', { ignoreFailures: true });

    // Add slight delay after starting func to hopefully increase reliability of tests
    await delay(30 * 1000);
});

after(async () => {
    testsDone = true;
    await killFuncProc();
});

beforeEach(async () => {
    perTestFuncOutput = '';
});

async function killFuncProc(): Promise<void> {
    const results = await findProcess('port', 7071);
    for (const result of results) {
        console.log(`Killing process ${result.name} with id ${result.pid}`);
        process.kill(result.pid, 'SIGINT');
    }
}

interface WaitForOutputOptions {
    checkFullOutput?: boolean;
    ignoreFailures?: boolean;
}

export async function waitForOutput(data: string, options?: WaitForOutputOptions): Promise<void> {
    const start = Date.now();
    while (true) {
        if (options?.checkFullOutput && fullFuncOutput.includes(data)) {
            return;
        } else if (perTestFuncOutput.includes(data)) {
            return;
        }

        if (!options?.ignoreFailures) {
            const failedMatch = perTestFuncOutput.match(/Executed 'Functions\.([^']+)' \(Failed/i);
            if (failedMatch) {
                const functionName = failedMatch[1];
                // throw error for any function that isn't supposed to fail
                if (functionName !== 'timerTriggerWithRetry') {
                    throw new Error(`Function "${functionName}" failed`);
                }
            }
        }

        if (Date.now() > start + defaultTimeout * 0.9) {
            throw new Error(`Timed out while waiting for "${data}"`);
        } else {
            await delay(200);
        }
    }
}

async function startFuncProcess(appPath: string): Promise<void> {
    await fs.writeFile(
        path.join(appPath, 'local.settings.json'),
        JSON.stringify(
            {
                IsEncrypted: false,
                Values: {
                    AzureWebJobsStorage: storageConnectionString,
                    FUNCTIONS_WORKER_RUNTIME: 'node',
                    logging__logLevel__Worker: 'debug',
                    [EnvVarNames.storage]: storageConnectionString,
                    [EnvVarNames.eventHub]: eventHubConnectionString,
                    [EnvVarNames.cosmosDB]: cosmosDBConnectionString,
                    [EnvVarNames.serviceBus]: serviceBusConnectionString,
                    [EnvVarNames.sql]: sqlConnectionString,
                    FUNCTIONS_REQUEST_BODY_SIZE_LIMIT: '4294967296',
                },
            },
            null,
            4
        )
    );

    childProc = cp.spawn('func', ['start'], {
        cwd: appPath,
        shell: true,
    });

    childProc.stdout?.on('data', (data: string | Buffer) => {
        data = data.toString();
        if (!funcCliSettings.hideOutput) {
            process.stdout.write(data);
        }
        perTestFuncOutput += data;
        fullFuncOutput += data;
    });

    childProc.stderr?.on('data', (data: string | Buffer) => {
        data = data.toString();
        process.stderr.write(data);
        perTestFuncOutput += data;
        fullFuncOutput += data;
    });

    childProc.on('error', (err) => {
        if (!testsDone) {
            console.error(err.message);
            process.exit(1);
        }
    });
    childProc.on('close', (code: number) => {
        if (!testsDone) {
            console.error(`func exited with code ${code}`);
            process.exit(1);
        }
    });
}
