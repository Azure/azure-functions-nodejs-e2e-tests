// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

// export async function httpTriggerQuery(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
//     return {
//         jsonBody: {
//             query: Object.fromEntries(request.query),
//             dupe: request.query.get('dupe'),
//             dupeAll: request.query.getAll('dupe'),
//         },
//     };
// }

// app.http('httpTriggerQuery', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: httpTriggerQuery,
// });
