// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { expect } from 'chai';
import { defaultTimeout, MCP } from './constants';
import { isOldConfig, model, waitForOutput } from './global.test';
import { delay } from './utils/delay';

interface McpContent {
    type: string;
    text?: string;
}

interface McpToolResult {
    structuredContent?: McpToolPayload;
    content: McpContent[];
}

interface McpToolPayload {
    success: boolean;
    query: string;
    resultCount: number;
    results: unknown[];
}

describe('mcp', function () {
    let mcpEndpointUrl: string;

    // MCP tests are only supported in v4 model with new config
    before(async function () {
        if (model !== 'v4' || isOldConfig) {
            this.skip();
        }

        await waitForOutput('Functions:', { checkFullOutput: true });
        await waitForOutput('MCP server endpoint:', { checkFullOutput: true });

        mcpEndpointUrl = await resolveMcpEndpointUrl();
    });

    // Set longer timeout for MCP operations
    this.timeout(defaultTimeout);

    let client: Client;
    let transport: StreamableHTTPClientTransport;

    beforeEach(async function () {
        client = new Client({
            name: 'azure-functions-e2e-test-client',
            version: '1.0.0',
        });

        transport = new StreamableHTTPClientTransport(new URL(mcpEndpointUrl));
    });

    afterEach(async function () {
        try {
            await client.close();
        } catch {
            // Ignore close errors in cleanup
        }
    });

    describe('mcpToolTrigger', () => {
        it('should list the searchTool from mcpToolTrigger', async function () {
            await client.connect(transport);

            const toolsResult = await client.listTools();

            expect(toolsResult.tools).to.be.an('array');

            const searchTool = toolsResult.tools.find((t) => t.name === MCP.searchToolName);
            expect(searchTool).to.not.be.undefined;
            expect(searchTool?.description).to.include('search');
            expect(searchTool?.inputSchema).to.be.an('object');
        });

        it('should invoke searchTool and return results', async function () {
            await client.connect(transport);

            const result = (await client.callTool({
                name: MCP.searchToolName,
                arguments: {
                    query: 'test-query',
                    maxResults: 5,
                },
            })) as McpToolResult;

            expect(result).to.have.property('content');
            expect(result.content).to.be.an('array');
            expect(result.content.length).to.be.greaterThan(0);

            const textContent = result.content.find((c: McpContent) => c.type === 'text');
            expect(textContent).to.not.be.undefined;

            const parsed = parseToolPayload(result, textContent?.text);
            expect(parsed.success).to.be.true;
            expect(parsed.query).to.equal('test-query');
            expect(parsed.results).to.be.an('array');
        });

        it('should invoke searchTool with default maxResults', async function () {
            await client.connect(transport);

            const result = (await client.callTool({
                name: MCP.searchToolName,
                arguments: {
                    query: 'another-query',
                },
            })) as McpToolResult;

            expect(result).to.have.property('content');
            expect(result.content).to.be.an('array');

            const textContent = result.content.find((c: McpContent) => c.type === 'text');
            expect(textContent).to.not.be.undefined;

            const parsed = parseToolPayload(result, textContent?.text);
            expect(parsed.success).to.be.true;
            expect(parsed.query).to.equal('another-query');
        });
    });

    describe('mcpResourceTrigger', () => {
        it('should list the testConfig resource from mcpResourceTrigger', async function () {
            await client.connect(transport);

            const resourcesResult = await client.listResources();

            expect(resourcesResult.resources).to.be.an('array');

            const testConfigResource = resourcesResult.resources.find(
                (r) => r.uri === MCP.testConfigResourceUri || r.name === MCP.testConfigResourceName
            );
            expect(testConfigResource).to.not.be.undefined;
            expect(testConfigResource?.name).to.equal(MCP.testConfigResourceName);
            expect(testConfigResource?.mimeType).to.equal('application/json');
        });

        it('should read testConfig resource and return configuration data', async function () {
            await client.connect(transport);

            const result = await client.readResource({
                uri: MCP.testConfigResourceUri,
            });

            expect(result).to.have.property('contents');
            expect(result.contents).to.be.an('array');
            expect(result.contents.length).to.be.greaterThan(0);

            const content = result.contents[0] as {
                uri: string;
                text?: string;
                mimeType?: string;
            };
            expect(content.uri).to.equal(MCP.testConfigResourceUri);
            expect(content.mimeType).to.equal('application/json');

            const parsed = JSON.parse(content.text!);
            expect(parsed.version).to.equal('1.0.0');
            expect(parsed.status).to.equal('active');
            expect(parsed.config).to.be.an('object');
            expect(parsed.config.enableFeatureA).to.be.true;
            expect(parsed.config.maxItems).to.equal(100);
        });
    });

    describe('mcp server capabilities', () => {
        it('should connect and report server capabilities', async function () {
            await client.connect(transport);

            const serverCapabilities = client.getServerCapabilities();
            expect(serverCapabilities).to.not.be.undefined;

            // Server should support tools and resources
            expect(serverCapabilities?.tools).to.not.be.undefined;
            expect(serverCapabilities?.resources).to.not.be.undefined;
        });

        it('should report server version information', async function () {
            await client.connect(transport);

            const serverVersion = client.getServerVersion();
            expect(serverVersion).to.not.be.undefined;
            expect(serverVersion?.name).to.be.a('string');
        });
    });
});

async function resolveMcpEndpointUrl(): Promise<string> {
    const candidates = [MCP.streamableUrl, MCP.sseUrl, MCP.legacySseUrl];
    const start = Date.now();
    let lastError: unknown;

    while (Date.now() < start + defaultTimeout * 0.5) {
        for (const candidate of candidates) {
            try {
                const response = await fetch(candidate, { method: 'GET' });
                if (response.status !== 404) {
                    return candidate;
                }
            } catch (err) {
                lastError = err;
            }
        }

        await delay(500);
    }

    throw new Error(`Timed out waiting for MCP endpoint to become available. Last error: ${String(lastError)}`);
}

function parseToolPayload(result: McpToolResult, textContent?: string): McpToolPayload {
    if (result.structuredContent) {
        return result.structuredContent;
    }

    if (!textContent) {
        throw new Error('MCP tool response did not include text content or structuredContent.');
    }

    const parsed = JSON.parse(textContent) as Record<string, unknown>;
    if (typeof parsed.success === 'boolean') {
        return parsed as unknown as McpToolPayload;
    }

    const nestedContent = parsed.content;
    if (Array.isArray(nestedContent)) {
        const nestedText = nestedContent.find(
            (item): item is McpContent => typeof item === 'object' && item !== null && 'type' in item && 'text' in item
        )?.text;
        if (nestedText) {
            return JSON.parse(nestedText) as McpToolPayload;
        }
    }

    throw new Error(`Unexpected MCP tool response payload: ${textContent}`);
}
