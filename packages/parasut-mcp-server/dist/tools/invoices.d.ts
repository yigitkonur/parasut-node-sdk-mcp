/**
 * Invoice Tools
 *
 * Tools for managing sales invoices - the core of Paraşüt.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const invoiceTools: Tool[];
export declare function handleSearchInvoices(args: unknown): Promise<ToolResponse>;
export declare function handleGetInvoice(args: unknown): Promise<ToolResponse>;
export declare function handleCreateInvoice(args: unknown): Promise<ToolResponse>;
export declare function handleCancelInvoice(args: unknown): Promise<ToolResponse>;
export declare function handleRecoverInvoice(args: unknown): Promise<ToolResponse>;
export declare function handleInvoicePdf(args: unknown): Promise<ToolResponse>;
export declare function handleRecordInvoicePayment(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=invoices.d.ts.map