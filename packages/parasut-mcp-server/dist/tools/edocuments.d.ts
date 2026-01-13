/**
 * E-Document Tools
 *
 * Tools for Turkish electronic invoicing (e-fatura, e-arşiv, e-SMM).
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { type ToolResponse } from '../utils/response.js';
export declare const edocumentTools: Tool[];
export declare function handleCheckEInvoiceInbox(args: unknown): Promise<ToolResponse>;
export declare function handleSendEInvoice(args: unknown): Promise<ToolResponse>;
export declare function handleSendEArchive(args: unknown): Promise<ToolResponse>;
export declare function handleSendESmm(args: unknown): Promise<ToolResponse>;
//# sourceMappingURL=edocuments.d.ts.map