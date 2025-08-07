// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export let storageConnectionString: string;
export let cosmosDBConnectionString: string;
export let eventHubConnectionString: string;
export let serviceBusConnectionString: string;
export let sqlConnectionString: string;
export let sqlTestConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    const password = process.env.SA_PASSWORD;
    if (!password || password.trim() === '') {
        throw new Error('Missing required environment variable: SA_PASSWORD');
    }

    storageConnectionString = "UseDevelopmentStorage=true";
    cosmosDBConnectionString = "AccountEndpoint=http://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
    serviceBusConnectionString = eventHubConnectionString = "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;";
    sqlConnectionString = `Server=localhost,15433;Database=master;User Id=sa;Password=${password};Encrypt=false;TrustServerCertificate=true;`;
    sqlTestConnectionString = `Server=localhost,15433;Database=DB;User Id=sa;Password=${password};Encrypt=false;TrustServerCertificate=true;`;
}
