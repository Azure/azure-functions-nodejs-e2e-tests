// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { AzureFunction, Context, HttpRequest } from '@azure/functions';
// import * as util from 'util';

// const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     context.log(`Http function processed request for url "${req.url}"`);

//     context.res = {
//         body: {
//             body: formatIfBuffer(req.body),
//             rawBody: formatIfBuffer(req.rawBody),
//             bufferBody: formatIfBuffer(req.bufferBody),
//         },
//     };
// };

// export default httpTrigger;

// function formatIfBuffer(data: any): any {
//     return Buffer.isBuffer(data) ? util.format(data) : data;
// }
