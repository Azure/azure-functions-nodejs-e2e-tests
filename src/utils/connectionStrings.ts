// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export let storageConnectionString: string;
export let cosmosDBConnectionString: string;
export let eventHubConnectionString: string;
export let serviceBusConnectionString: string;
export let sqlConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    storageConnectionString = "UseDevelopmentStorage=true";
    cosmosDBConnectionString = "AccountEndpoint=http://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
    serviceBusConnectionString = eventHubConnectionString = "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;";
    sqlConnectionString = "Server=localhost;UserID=root;Password=password;Database=testdb;Port=3307"
}
