// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export let storageConnectionString: string;
export let cosmosDBConnectionString: string;
export let cosmosDBMongoConnectionString: string;
export let eventHubConnectionString: string;
export let serviceBusConnectionString: string;
export let sqlConnectionString: string;
export let sqlTestConnectionString: string;

export async function initializeConnectionStrings(): Promise<void> {
    storageConnectionString = "UseDevelopmentStorage=true";
    cosmosDBConnectionString = "AccountEndpoint=http://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
    cosmosDBMongoConnectionString = "mongodb://localhost:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@localhost@";
    serviceBusConnectionString = eventHubConnectionString = "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;";
    sqlConnectionString = `Server=localhost,15433;Database=master;User Id=sa;Password=${process.env.SA_PASSWORD};Encrypt=false;TrustServerCertificate=true;`;
    sqlTestConnectionString = `Server=localhost,15433;Database=e2eTestDB;User Id=sa;Password=${process.env.SA_PASSWORD};Encrypt=false;TrustServerCertificate=true;`;
}
