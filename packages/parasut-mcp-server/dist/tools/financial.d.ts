/**
 * Financial Tools
 *
 * Tools for accounts, transactions, and financial overview.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const financialTools: Tool[];
export declare function handleListAccounts(args: unknown): Promise<ToolResponse>;
export declare function handleSearchTransactions(args: unknown): Promise<ToolResponse>;
export declare function handleCreateBankFee(args: unknown): Promise<ToolResponse>;
export declare function handleGetFinancialSummary(_args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=financial.d.ts.map