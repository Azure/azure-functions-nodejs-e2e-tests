// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const cosmosDBTrigger: AzureFunction = async function (context: Context, documents: any[]): Promise<void> {
    context.log(`cosmosDBTrigger2 processed ${documents.length} documents`);
    for (const document of documents) {
        context.log(`cosmosDBTrigger2 was triggered by "${document.message}"`);
    }
};

export default cosmosDBTrigger;
