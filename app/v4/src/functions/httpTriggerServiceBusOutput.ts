// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

// const serviceBusOutput = output.serviceBusQueue({
//     connection: 'e2eTest_serviceBus',
//     queueName: 'e2eTestQueueOneTrigger',
// });

// export async function httpTriggerServiceBusOutput(
//     request: HttpRequest,
//     context: InvocationContext
// ): Promise<HttpResponseInit> {
//     const body = <{ output: any }>await request.json();
//     context.extraOutputs.set(serviceBusOutput, body.output);
//     return { body: 'done' };
// }

// app.http('httpTriggerServiceBusOutput', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     extraOutputs: [serviceBusOutput],
//     handler: httpTriggerServiceBusOutput,
// });
