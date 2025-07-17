// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { addRandomAsyncOrSyncDelay } from '../utils/getRandomTestData';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(`Http function processed request for url "${req.url}"`);

    await addRandomAsyncOrSyncDelay();

    const name = req.query.name || req.body || 'world';

    context.res = {
        body: `Hello, ${name}!`,
    };
};

export default httpTrigger;
