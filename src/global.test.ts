// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import cp from 'child_process';
import path from 'path';
import semver from 'semver';
import { EnvVarNames, defaultTimeout } from './constants';
import { Model, getModelArg } from './getModelArg';
import {
    cosmosDBConnectionString,
    eventHubConnectionString,
    initializeConnectionStrings,
    serviceBusConnectionString,
    storageConnectionString,
} from './resources/connectionStrings';
import { delay } from './utils/delay';
import findProcess = require('find-process');

let perTestFuncOutput = '';
let fullFuncOutput = '';
export let model: Model | undefined;
let childProc: cp.ChildProcess | undefined;
let testsDone = false;

before(async function (this: Mocha.Context): Promise<void> {
    model = getModelArg();
    if (model === 'v4' && semver.lt(process.versions.node, '18.0.0')) {
        this.skip();
    }

    await killFuncProc();

    await initializeConnectionStrings();

    const appPath = path.join(__dirname, '..', 'app', model);
    startFuncProcess(appPath);
    await waitForOutput('Host lock lease acquired by instance ID');

    // Add slight delay after starting func to hopefully increase reliability of tests
    await delay(30 * 1000);
});

after(async () => {
    testsDone = true;
    await killFuncProc();
});

afterEach(async () => {
    perTestFuncOutput = '';
});

async function killFuncProc(): Promise<void> {
    const results = await findProcess('port', 7071);
    for (const result of results) {
        console.log(`Killing process ${result.name} with id ${result.pid}`);
        process.kill(result.pid, 'SIGINT');
    }
}

export async function waitForOutput(data: string, checkFullOutput = false): Promise<void> {
    const start = Date.now();
    while (true) {
        if (checkFullOutput && fullFuncOutput.includes(data)) {
            return;
        } else if (perTestFuncOutput.includes(data)) {
            return;
        } else if (Date.now() > start + defaultTimeout * 0.9) {
            throw new Error(`Timed out while waiting for "${data}"`);
        } else {
            await delay(200);
        }
    }
}

function startFuncProcess(appPath: string): void {
    const options: cp.SpawnOptions = {
        cwd: appPath,
        shell: true,
        env: {
            ...process.env,
            AzureWebJobsStorage: storageConnectionString,
            FUNCTIONS_WORKER_RUNTIME: 'node',
            AzureWebJobsFeatureFlags: 'EnableWorkerIndexing',
            logging__logLevel__Worker: 'debug',
            [EnvVarNames.storage]: storageConnectionString,
            [EnvVarNames.eventHub]: eventHubConnectionString,
            [EnvVarNames.cosmosDB]: cosmosDBConnectionString,
            [EnvVarNames.serviceBus]: serviceBusConnectionString,
        },
    };

    const funcPath = path.join(__dirname, '..', 'func-cli', 'func');
    childProc = cp.spawn(funcPath, ['start'], options);

    childProc.stdout?.on('data', (data: string | Buffer) => {
        data = data.toString();
        process.stdout.write(data);
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
