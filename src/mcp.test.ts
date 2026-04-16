// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { expect } from 'chai';
import { defaultTimeout, MCP } from './constants';
import { isOldConfig, model } from './global.test';

interface McpContent {
    type: string;
    text?: string;
}

interface McpToolResult {
    content: McpContent[];
}

describe('mcp', function () {
    // MCP tests are only supported in v4 model with new config
    before(function () {
        if (model !== 'v4' || isOldConfig) {
            this.skip();
        }
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

        transport = new StreamableHTTPClientTransport(new URL(MCP.sseUrl));
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

            const parsed = JSON.parse(textContent!.text!);
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

            const parsed = JSON.parse(textContent!.text!);
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
