// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext, SqlChange, SqlChangeOperation } from '@azure/functions';

export async function sqlTrigger(changes: SqlChange[], context: InvocationContext): Promise<void> {
    context.log(`sqlTrigger processed ${changes.length} changes`);
    for (const change of changes) {
        let operation: string;
        switch (change.Operation) {
            case SqlChangeOperation.Insert:
                operation = 'insert';
                break;
            case SqlChangeOperation.Update:
                operation = 'update';
                break;
            case SqlChangeOperation.Delete:
                operation = 'delete';
                break;
            default:
                throw RangeError(change.Operation);
        }
        context.log(`sqlTrigger was triggered by operation "${operation}" for "${JSON.stringify(change.Item)}"`);
    }
}

app.sql('sqlTrigger', {
    tableName: 'dbo.e2eSqlTriggerTable',
    connectionStringSetting: 'e2eTest_sql',
    handler: sqlTrigger,
});
