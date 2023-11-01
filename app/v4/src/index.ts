// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app } from '@azure/functions';

app.hook.appStart((context) => {
    context.hookData.testData = 'appStartHookData123';
    console.log('appStart hook executed.');
});

app.hook.appTerminate((context) => {
    console.log(`appTerminate hook executed with hook data ${context.hookData.testData}`);
});

app.hook.preInvocation((context) => {
    if (context.invocationContext.functionName === 'httpTriggerForHooks') {
        context.invocationContext.log(
            `preInvocation hook executed with inputs ${JSON.stringify(context.inputs.map((v) => v.constructor.name))}`
        );

        context.inputs.push('extraTestInput12345');

        const oldHandler: any = context.functionHandler;
        context.functionHandler = (...args) => {
            context.invocationContext.log('extra log from updated functionHandler');
            return oldHandler(...args);
        };

        context.hookData.testData = 'preInvocationHookData123';

        // Validate readonly properties
        try {
            // @ts-expect-error by-design
            context.hookData = {};
        } catch (err) {
            context.invocationContext.log(`Ignored error: ${err.message}`);
        }

        try {
            // @ts-expect-error by-design
            context.invocationContext = {};
        } catch (err) {
            context.invocationContext.log(`Ignored error: ${err.message}`);
        }
    }
});

const hookToDispose = app.hook.preInvocation((context) => {
    context.invocationContext.log('This should never run.');
});
hookToDispose.dispose();

app.hook.postInvocation((context) => {
    if (context.invocationContext.functionName === 'httpTriggerForHooks') {
        const resultString = JSON.stringify(context.result);
        context.invocationContext.log(
            `postInvocation hook executed with error: ${context.error}, result: ${resultString}, hook data: ${context.hookData.testData}`
        );
    }
});

app.hook.postInvocation(async () => {
    // Add slight delay to ensure logs show up before the invocation finishes
    // See these issues for more info:
    // https://github.com/Azure/azure-functions-host/issues/9238
    // https://github.com/Azure/azure-functions-host/issues/8222
    await new Promise((resolve) => setTimeout(resolve, 50));
});
