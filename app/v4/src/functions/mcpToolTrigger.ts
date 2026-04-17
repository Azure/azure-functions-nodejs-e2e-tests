// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, arg, InvocationContext } from '@azure/functions';

export interface McpToolInput {
    arguments?: {
        query?: string;
        maxResults?: number;
    };
}

export interface McpToolResult {
    success: boolean;
    query: string;
    resultCount: number;
    results: Array<{
        id: number;
        name: string;
        score: number;
    }>;
}

export async function mcpToolTrigger(input: McpToolInput, context: InvocationContext): Promise<McpToolResult> {
    context.log('mcpToolTrigger was triggered');
    context.log(`Tool input: ${JSON.stringify(input)}`);

    const query = input.arguments?.query || 'default';
    const maxResults = input.arguments?.maxResults || 10;

    context.log(`Processing query: "${query}" with maxResults: ${maxResults}`);

    // Simulate tool execution - in a real scenario, this would perform actual work
    const results = [
        { id: 1, name: `Result for ${query}`, score: 0.95 },
        { id: 2, name: `Another result for ${query}`, score: 0.85 },
    ];

    const limitedResults = results.slice(0, maxResults);

    return {
        success: true,
        query,
        resultCount: limitedResults.length,
        results: limitedResults,
    };
}

app.mcpTool('mcpToolTrigger', {
    toolName: 'searchTool',
    description: 'A test search tool that simulates searching for items based on a query string',
    toolProperties: {
        query: arg.string().describe('The search query string'),
        maxResults: arg.integer().describe('Maximum number of results to return').optional(),
    },
    handler: mcpToolTrigger,
});
