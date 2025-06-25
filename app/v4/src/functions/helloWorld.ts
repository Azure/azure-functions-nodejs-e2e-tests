// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

// export async function helloWorld(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
//     context.log(`Http function processed request for url "${request.url}"`);

//     const name = request.query.get('name') || (await request.text()) || 'world';

//     return { body: `Hello, ${name}!` };
// }

// app.http('helloWorld', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: helloWorld,
// });
