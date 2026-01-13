/**
 * Inventory Tools
 *
 * Tools for stock levels and inventory tracking.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const inventoryTools: Tool[];
export declare function handleGetStockLevels(args: unknown): Promise<ToolResponse>;
export declare function handleSearchStockMovements(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=inventory.d.ts.map