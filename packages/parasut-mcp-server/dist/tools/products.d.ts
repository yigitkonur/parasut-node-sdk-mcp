/**
 * Product Tools
 *
 * Tools for managing products and services.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const productTools: Tool[];
export declare function handleSearchProducts(args: unknown): Promise<ToolResponse>;
export declare function handleGetProduct(args: unknown): Promise<ToolResponse>;
export declare function handleCreateProduct(args: unknown): Promise<ToolResponse>;
export declare function handleUpdateProduct(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=products.d.ts.map