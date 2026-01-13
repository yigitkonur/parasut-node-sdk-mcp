/**
 * Contact Tools
 *
 * Tools for managing customers and suppliers.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const contactTools: Tool[];
export declare function handleSearchContacts(args: unknown): Promise<ToolResponse>;
export declare function handleGetContact(args: unknown): Promise<ToolResponse>;
export declare function handleCreateContact(args: unknown): Promise<ToolResponse>;
export declare function handleUpdateContact(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=contacts.d.ts.map