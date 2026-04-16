// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, InvocationContext } from '@azure/functions';

export interface McpResourceInput {
    uri?: string;
}

export interface McpResourceResult {
    contents: Array<{
        uri: string;
        mimeType: string;
        text?: string;
        blob?: string;
    }>;
}

export async function mcpResourceTrigger(
    input: McpResourceInput,
    context: InvocationContext
): Promise<McpResourceResult> {
    context.log('mcpResourceTrigger was triggered');
    context.log(`Resource input: ${JSON.stringify(input)}`);

    // Simulate resource retrieval - in a real scenario, this would fetch actual data
    const testData = {
        version: '1.0.0',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        config: {
            enableFeatureA: true,
            enableFeatureB: false,
            maxItems: 100,
        },
    };

    return {
        contents: [
            {
                uri: 'mcp://test/config',
                mimeType: 'application/json',
                text: JSON.stringify(testData, null, 2),
            },
        ],
    };
}

app.mcpResource('mcpResourceTrigger', {
    uri: 'mcp://test/config',
    resourceName: 'testConfig',
    title: 'Test Configuration Resource',
    description: 'A test MCP resource that provides configuration data for testing purposes',
    mimeType: 'application/json',
    handler: mcpResourceTrigger,
});
