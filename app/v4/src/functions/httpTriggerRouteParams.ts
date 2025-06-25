// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

// export async function httpTriggerRouteParams(
//     request: HttpRequest,
//     context: InvocationContext
// ): Promise<HttpResponseInit> {
//     return { jsonBody: request.params };
// }

// app.http('httpTriggerRouteParams', {
//     methods: ['GET', 'POST'],
//     route: 'httpTriggerRouteParams/{name}/{id}',
//     authLevel: 'anonymous',
//     handler: httpTriggerRouteParams,
// });
