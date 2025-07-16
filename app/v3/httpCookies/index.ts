// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { AzureFunction, Context, HttpRequest } from '@azure/functions';

// const httpCookies: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     context.log(`Http function processed request for url "${req.url}"`);

//     context.res = {
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
//                 maxAge: '200000',
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
// };

// export default httpCookies;
