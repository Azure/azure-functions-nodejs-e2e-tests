// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export let storageConnectionString: string;
export let eventHubConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    storageConnectionString = "UseDevelopmentStorage=true";
    eventHubConnectionString = "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;";
}
