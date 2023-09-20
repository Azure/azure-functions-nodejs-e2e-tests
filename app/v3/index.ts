// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as app from '@azure/functions';
import { registerHook } from '@azure/functions-core';

app.setup();

registerHook('postInvocation', async () => {
    // Add slight delay to ensure logs show up before the invocation finishes
    // See these issues for more info:
    // https://github.com/Azure/azure-functions-host/issues/9238
    // https://github.com/Azure/azure-functions-host/issues/8222
    await new Promise((resolve) => setTimeout(resolve, 50));
});
