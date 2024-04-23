// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as cp from 'child_process';

export async function getSubscriptionId(): Promise<string> {
    return executeCommand('az account show --query id -o tsv');
}

export async function getUserName(): Promise<string> {
    return executeCommand('az account show --query user.name -o tsv');
}

export async function getUserId(userName: string): Promise<string> {
    const userType = await executeCommand('az account show --query user.type -o tsv');
    if (userType === 'user') {
        return executeCommand(`az ad user show --id ${userName} --query id -o tsv`);
    } else {
        // In Azure Pipelines the userType will be 'servicePrincipal' and the userName will already be the id we need
        return userName;
    }
}

async function executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let stdout = '';

        const childProc = cp.spawn(command, { shell: true });

        childProc.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        childProc.stderr?.on('data', (data) => {
            console.error(data.toString());
        });

        childProc.on('error', reject);
        childProc.on('close', (code: number) => {
            if (code === 0) {
                resolve(stdout.trim());
            } else {
                reject(new Error(`Command "${command}" failed with exit code ${code}`));
            }
        });
    });
}
