// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

// export async function httpCookies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
//     context.log(`Http function processed request for url "${request.url}"`);

//     return {
//         cookies: [
//             {
//                 name: 'mycookie',
//                 value: 'myvalue',
//                 maxAge: 200000,
//             },
//             {
//                 name: 'mycookie2',
//                 value: 'myvalue',
//                 path: '/',
//                 maxAge: <any>'200000',
//             },
//             {
//                 name: 'mycookie3-expires',
//                 value: 'myvalue3-expires',
//                 maxAge: 0,
//             },
//             {
//                 name: 'mycookie4-samesite-lax',
//                 value: 'myvalue',
//                 sameSite: 'Lax',
//             },
//             {
//                 name: 'mycookie5-samesite-strict',
//                 value: 'myvalue',
//                 sameSite: 'Strict',
//             },
//         ],
//     };
// }

// app.http('httpCookies', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: httpCookies,
// });
