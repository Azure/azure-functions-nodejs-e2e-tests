// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';
import { getRequiredJsonBody, hasValidOutputEnvelope, validateObject } from '../utils/httpValidation';

const storageOutput = output.storageQueue({
    queueName: 'e2e-test-queue-trigger',
    connection: 'AzureWebJobsStorage',
});

export async function httpTriggerStorageQueueOutput(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const bodyResult = await getRequiredJsonBody(request);
    if ('response' in bodyResult) {
        return bodyResult.response;
    }

    const validationError = validateObject(
        bodyResult.value,
        (item) => hasValidOutputEnvelope(item),
        'Request body must include an "output" value.'
    );
    if (validationError) {
        return validationError;
    }

    context.extraOutputs.set(storageOutput, (bodyResult.value as { output: unknown }).output);
    return { body: 'done' };
}

app.http('httpTriggerStorageQueueOutput', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [storageOutput],
    handler: httpTriggerStorageQueueOutput,
});
