// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const cosmosDBTrigger: AzureFunction = async function (_context: Context, documents: any[]): Promise<void> {
    console.log(`cosmosDBTrigger2 processed ${documents.length} documents`);
    for (const document of documents) {
        console.log(`cosmosDBTrigger2 was triggered by "${document.message}"`);
    }
};

export default cosmosDBTrigger;
