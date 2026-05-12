// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getJsonBody, hasValidOutputEnvelope } from '../utils/httpValidation';

const httpTriggerServiceBusOutput: AzureFunction = async function (
    context: Context,
    request: HttpRequest
): Promise<void> {
    const body = getJsonBody(request);
    if (!hasValidOutputEnvelope(body)) {
        context.res = { status: 400 };
        return;
    }

    context.bindings.outputMsg = body.output;
    context.res = { body: 'done' };
};

export default httpTriggerServiceBusOutput;
