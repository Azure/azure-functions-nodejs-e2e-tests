// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, InvocationContext, Timer } from '@azure/functions';

// export async function timerTriggerWithRetry(_myTimer: Timer, context: InvocationContext): Promise<void> {
//     const retryCount = context.retryContext?.retryCount ?? 0;
//     if (retryCount < 2) {
//         throw new Error(`timerTriggerWithRetry error on attempt ${retryCount}`);
//     }
//     context.log(`timerTriggerWithRetry pass on attempt ${retryCount}`);
// }

// app.timer('timerTriggerWithRetry', {
//     schedule: '*/30 * * * * *',
//     retry: {
//         strategy: 'fixedDelay',
//         delayInterval: {
//             seconds: 1,
//         },
//         maxRetryCount: 5,
//     },
//     handler: timerTriggerWithRetry,
// });
