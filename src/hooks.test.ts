// // Copyright (c) .NET Foundation. All rights reserved.
// // Licensed under the MIT License.

// import { expect } from 'chai';
// import { default as fetch } from 'node-fetch';
// import { getFuncUrl } from './constants';
// import { model, waitForOutput } from './global.test';

// describe('hooks', () => {
//     before(function (this: Mocha.Context) {
//         if (model === 'v3') {
//             this.skip();
//         }
//     });

//     it('app start', async () => {
//         await waitForOutput(`Executing 1 "appStart" hooks`, { checkFullOutput: true });
//         await waitForOutput(`appStart hook executed.`, { checkFullOutput: true });
//         await waitForOutput(`Executed "appStart" hooks`, { checkFullOutput: true });
//     });

//     it('invocation', async () => {
//         const outputUrl = getFuncUrl('httpTriggerForHooks');

//         const response = await fetch(outputUrl, { method: 'POST' });
//         expect(response.status).to.equal(200);
//         const body = await response.text();
//         expect(body).to.equal('hookBodyResponse');

//         // pre invocation
//         await waitForOutput(`Executing 1 "preInvocation" hooks`);
//         await waitForOutput(`preInvocation hook executed with inputs ["HttpRequest"]`);
//         await waitForOutput(`Ignored error: Cannot assign to read only property 'hookData'`);
//         await waitForOutput(`Ignored error: Cannot assign to read only property 'invocationContext'`);
//         await waitForOutput(`Executed "preInvocation" hooks`);

//         // invocation
//         await waitForOutput(`extra log from updated functionHandler`);
//         await waitForOutput(`httpTriggerForHooks was triggered with second input extraTestInput12345`);

//         // post invocation
//         await waitForOutput(`Executing 2 "postInvocation" hooks`);
//         await waitForOutput(
//             `postInvocation hook executed with error: null, result: {"body":"hookBodyResponse"}, hook data: preInvocationHookData123`
//         );
//         await waitForOutput(`Executed "postInvocation" hooks`);
//     });
// });
