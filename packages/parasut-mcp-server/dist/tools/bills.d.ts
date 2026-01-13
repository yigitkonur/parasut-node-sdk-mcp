/**
 * Purchase Bill Tools
 *
 * Tools for managing expenses and purchase bills.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const billTools: Tool[];
export declare function handleSearchBills(args: unknown): Promise<ToolResponse>;
export declare function handleGetBill(args: unknown): Promise<ToolResponse>;
export declare function handleCreateBill(args: unknown): Promise<ToolResponse>;
export declare function handleRecordBillPayment(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=bills.d.ts.map