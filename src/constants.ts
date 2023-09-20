// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export namespace EnvVarNames {
    export const storage = 'e2eTest_storage';
    export const cosmosDB = 'e2eTest_cosmosDB';
    export const eventHub = 'e2eTest_eventHub';
    export const serviceBus = 'e2eTest_serviceBus';
    export const sql = 'e2eTest_sql';
}

export const defaultTimeout = 3 * 60 * 1000;

export const combinedFolder = 'combined';
export const oldBundleSuffix = '-oldBundle';

export function getFuncUrl(routeSuffix: string): string {
    return `http://127.0.0.1:7071/api/${routeSuffix}`;
}
