// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const sqlTrigger: AzureFunction = async function (context: Context, changes: any[]): Promise<void> {
    context.log(`sqlTrigger processed ${changes.length} changes`);
    for (const change of changes) {
        let operation: string;
        switch (change.Operation) {
            case 0:
                operation = 'insert';
                break;
            case 1:
                operation = 'update';
                break;
            case 2:
                operation = 'delete';
                break;
            default:
                throw RangeError(change.Operation);
        }
        context.log(`sqlTrigger was triggered by operation "${operation}" for "${JSON.stringify(change.Item)}"`);
    }
};

export default sqlTrigger;
