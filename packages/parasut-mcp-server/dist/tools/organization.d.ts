/**
 * Organization Tools
 *
 * Tools for categories, tags, employees, salaries, and taxes.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const organizationTools: Tool[];
export declare function handleListCategories(args: unknown): Promise<ToolResponse>;
export declare function handleListTags(args: unknown): Promise<ToolResponse>;
export declare function handleListEmployees(args: unknown): Promise<ToolResponse>;
export declare function handleCreateSalary(args: unknown): Promise<ToolResponse>;
export declare function handleCreateTax(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=organization.d.ts.map