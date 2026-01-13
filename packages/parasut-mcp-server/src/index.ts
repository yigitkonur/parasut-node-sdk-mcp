#!/usr/bin/env node
/**
 * Paraşüt MCP Server
 *
 * Model Context Protocol server for Paraşüt API.
 * Provides AI-friendly tools for Turkish accounting and invoicing.
 *
 * Usage:
 *   npx @parasut/mcp-server
 *
 * Environment Variables:
 *   PARASUT_COMPANY_ID    - Your company ID (required)
 *   PARASUT_CLIENT_ID     - OAuth client ID (required)
 *   PARASUT_CLIENT_SECRET - OAuth client secret (required)
 *   PARASUT_USERNAME      - Your username (required)
 *   PARASUT_PASSWORD      - Your password (required)
 *   PARASUT_BASE_URL      - API base URL (optional)
 *   DEBUG                 - Enable debug logging (optional)
 */

import { startServer } from './server.js';

// Start the server
startServer().catch((error) => {
  console.error('Failed to start Paraşüt MCP server:', error);
  process.exit(1);
});
