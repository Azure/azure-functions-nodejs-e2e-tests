// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as cp from 'child_process';
import * as parseArgs from 'minimist';
import * as path from 'path';
import { EnvVarNames } from './constants';
import {
    cosmosDBConnectionString,
    eventHubConnectionString,
    initializeConnectionStrings,
    storageConnectionString,
} from './resources/connectionStrings';
import { delay } from './utils/delay';
import findProcess = require('find-process');

export let funcOutput = '';
export let model: 'v3' | 'v4' | undefined;
let childProc: cp.ChildProcess | undefined;
let testsDone = false;

before(async function (this: Mocha.Context): Promise<void> {
    const args = parseArgs(process.argv.slice(2));
    const modelArg: string = args.model || args.m;
    if (modelArg === 'v3' || modelArg === 'v4') {
        model = modelArg;
    } else {
        throw new Error('You must pass in the model argument with "--model" or "-m". Valid values are "v3" or "v4".');
    }
    await killFuncProc();

    await initializeConnectionStrings();

    const appPath = path.join(__dirname, '..', 'app', model);
    startFuncProcess(appPath);
    await waitForOutput('Host lock lease acquired by instance ID');
});

after(async () => {
    testsDone = true;
    await killFuncProc();
});

afterEach(async () => {
    funcOutput = '';
});

async function killFuncProc(): Promise<void> {
    const results = await findProcess('port', 7071);
    for (const result of results) {
        console.log(`Killing process ${result.name} with id ${result.pid}`);
        process.kill(result.pid, 'SIGINT');
    }
}

export async function waitForOutput(data: string, timeout = 20 * 1000): Promise<void> {
    const start = Date.now();
    while (true) {
        if (funcOutput.includes(data)) {
            return;
        } else if (Date.now() > start + timeout) {
            throw new Error(`Timed out while waiting for "${data}"`);
        } else {
            await delay(200);
        }
    }
}

function startFuncProcess(appPath: string): void {
    const options: cp.SpawnOptions = {
        cwd: appPath,
        env: {
            ...process.env,
            AzureWebJobsStorage: storageConnectionString,
            FUNCTIONS_WORKER_RUNTIME: 'node',
            AzureWebJobsFeatureFlags: 'EnableWorkerIndexing',
            logging__logLevel__Worker: 'debug',
            [EnvVarNames.storage]: storageConnectionString,
            [EnvVarNames.eventHub]: eventHubConnectionString,
            [EnvVarNames.cosmosDB]: cosmosDBConnectionString,
        },
    };
    childProc = cp.spawn('func', ['start'], options);

    childProc.stdout?.on('data', (data: string | Buffer) => {
        data = data.toString();
        console.log(data);
        funcOutput += data;
    });

    childProc.stderr?.on('data', (data: string | Buffer) => {
        data = data.toString();
        console.error(data);
        funcOutput += data;
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
