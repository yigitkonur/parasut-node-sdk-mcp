/**
 * Paraşüt MCP Server
 *
 * Model Context Protocol server for Paraşüt API.
 * Provides tools for Turkish accounting and invoicing operations.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { type ServerConfig } from './config.js';
/**
 * Creates and configures the MCP server.
 */
export declare function createServer(config: ServerConfig): Server;
/**
 * Starts the MCP server with stdio transport.
 */
export declare function startServer(): Promise<void>;
//# sourceMappingURL=server.d.ts.map