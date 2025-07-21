// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

// const tableOutput = output.table({
//     tableName: 'e2etesttable',
//     connection: 'e2eTest_storage',
// });

// export async function httpTriggerTableOutput(
//     request: HttpRequest,
//     context: InvocationContext
// ): Promise<HttpResponseInit> {
//     context.log(`httpTriggerTableOutput was triggered`);
//     const body = await request.json();
//     context.extraOutputs.set(tableOutput, body);
//     return { status: 201 };
// }

// app.http('httpTriggerTableOutput', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     extraOutputs: [tableOutput],
//     handler: httpTriggerTableOutput,
// });
