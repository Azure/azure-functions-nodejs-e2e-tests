// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, Timer } from '@azure/functions';

export async function timerTrigger1(_myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('timerTrigger1 was triggered');
}

app.timer('timerTrigger1', {
    schedule: '*/30 * * * * *',
    handler: timerTrigger1,
});
