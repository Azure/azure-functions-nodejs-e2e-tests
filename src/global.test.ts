// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as cp from 'child_process';
import * as path from 'path';
import * as treeKill from 'tree-kill';
import { delay } from './utils/delay';
import { nonNullProp } from './utils/nonNull';

export let funcOutput = '';
let childProc: cp.ChildProcess | undefined;
let testsDone = false;

before(async function (this: Mocha.Context): Promise<void> {
    const appPath = path.join(__dirname, '..', 'app', 'v4');
    startFuncProcess(appPath);
    await waitForOutput('Host lock lease acquired by instance ID');
});

after(async () => {
    testsDone = true;
    await killFuncProc();
});

async function killFuncProc(): Promise<void> {
    if (childProc) {
        const pid = nonNullProp(childProc, 'pid');
        treeKill(pid, 'SIGINT');
        while (isRunning(pid)) {
            await delay(1000);
        }
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
            FUNCTIONS_WORKER_RUNTIME: 'node',
            AzureWebJobsFeatureFlags: 'EnableWorkerIndexing',
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

function isRunning(pid: number): boolean {
    try {
        // https://nodejs.org/api/process.html#process_process_kill_pid_signal
        // This method will throw an error if the target pid does not exist. As a special case, a signal of 0 can be used to test for the existence of a process.
        // Even though the name of this function is process.kill(), it is really just a signal sender, like the kill system call.
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
}
