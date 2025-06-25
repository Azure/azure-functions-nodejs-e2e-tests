// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export namespace EnvVarNames {
    export const storage = 'AzureWebJobsStorage';
    export const eventHub = 'EventHubConnection';
}

export const defaultTimeout = 3 * 60 * 1000;

export const combinedFolder = 'combined';
export const oldConfigSuffix = '-oldConfig';

export function getFuncUrl(routeSuffix: string): string {
    return `http://127.0.0.1:7071/api/${routeSuffix}`;
}
