/**
 * Error Handling Utilities
 *
 * Converts SDK errors to MCP tool responses with recovery guidance.
 * Every error should teach the user how to fix the problem.
 */
import type { ToolResponse } from './response.js';
export interface NextStep {
    action: string;
    example?: string;
}
export interface ErrorMetadata {
    error_code: string;
    recoverable: boolean;
    retry_after_ms?: number;
}
/**
 * Converts any error to an MCP tool error response.
 * Provides context-specific recovery guidance.
 */
export declare function handleError(error: unknown, context?: {
    operation?: string;
    resourceType?: string;
    suggestions?: NextStep[];
}): ToolResponse;
/**
 * Wraps an async handler with error handling.
 * Converts all errors to proper MCP tool responses.
 */
export declare function withErrorHandling<T extends unknown[], R>(handler: (...args: T) => Promise<R>, context?: {
    operation?: string;
    resourceType?: string;
}): (...args: T) => Promise<R | ToolResponse>;
//# sourceMappingURL=errors.d.ts.map