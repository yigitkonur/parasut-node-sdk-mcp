/**
 * Tool Registry
 *
 * Registers all tools and dispatches tool calls to handlers.
 */
import type { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
/**
 * Returns all registered tools.
 */
export declare function getAllTools(): Tool[];
/**
 * Handles a tool call by dispatching to the appropriate handler.
 */
export declare function handleToolCall(name: string, args: Record<string, unknown>): Promise<CallToolResult>;
/**
 * Returns a summary of registered tools by category.
 */
export declare function getToolSummary(): Record<string, number>;
//# sourceMappingURL=index.d.ts.map