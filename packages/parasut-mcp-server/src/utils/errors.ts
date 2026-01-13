/**
 * Error Handling Utilities
 *
 * Converts SDK errors to MCP tool responses with recovery guidance.
 * Every error should teach the user how to fix the problem.
 */

import {
  ParasutApiError,
  ParasutAuthError,
  ParasutNotFoundError,
  ParasutRateLimitError,
  ParasutValidationError,
  ParasutNetworkError,
} from '@yigitkonur/parasut-node-sdk';
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
export function handleError(
  error: unknown,
  context?: {
    operation?: string;
    resourceType?: string;
    suggestions?: NextStep[];
  }
): ToolResponse {
  // Handle SDK errors
  if (error instanceof ParasutNotFoundError) {
    return handleNotFoundError(error, context);
  }

  if (error instanceof ParasutValidationError) {
    return handleValidationError(error, context);
  }

  if (error instanceof ParasutAuthError) {
    return handleAuthError(error);
  }

  if (error instanceof ParasutRateLimitError) {
    return handleRateLimitError(error);
  }

  if (error instanceof ParasutNetworkError) {
    return handleNetworkError(error);
  }

  if (error instanceof ParasutApiError) {
    return handleApiError(error, context);
  }

  // Handle unknown errors
  return handleUnknownError(error, context);
}

function handleNotFoundError(
  error: ParasutNotFoundError,
  context?: { resourceType?: string; suggestions?: NextStep[] }
): ToolResponse {
  const resourceType = context?.resourceType ?? 'Resource';
  const suggestions = context?.suggestions ?? [];

  const parts: string[] = [
    `Error: ${resourceType} not found.`,
    '',
    'Possible causes:',
    '- The ID may be incorrect or misspelled',
    '- The resource may have been deleted',
    '- You may not have access to this resource',
  ];

  if (suggestions.length > 0) {
    parts.push('', 'Try:');
    for (const step of suggestions) {
      if (step.example) {
        parts.push(`- ${step.action}: ${step.example}`);
      } else {
        parts.push(`- ${step.action}`);
      }
    }
  }

  // Include original error details if available
  if (error.errors?.length) {
    parts.push('', 'Details:');
    for (const err of error.errors) {
      parts.push(`- ${err.title}: ${err.detail}`);
    }
  }

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
  };
}

function handleValidationError(
  error: ParasutValidationError,
  context?: { operation?: string }
): ToolResponse {
  const operation = context?.operation ?? 'Operation';

  const parts: string[] = [
    `Error: ${operation} failed due to validation errors.`,
    '',
    'Issues found:',
  ];

  if (error.errors?.length) {
    for (const err of error.errors) {
      parts.push(`- ${err.title}: ${err.detail}`);
    }
  } else {
    parts.push('- Unknown validation error');
  }

  parts.push(
    '',
    'Fix: Check the parameter values and try again.',
    'Common issues:',
    '- Required fields are missing',
    '- Values are in wrong format (e.g., date should be YYYY-MM-DD)',
    '- Referenced IDs (contact, product) do not exist'
  );

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
  };
}

function handleAuthError(_error: ParasutAuthError): ToolResponse {
  const parts: string[] = [
    'Error: Authentication failed.',
    '',
    'Possible causes:',
    '- Your credentials may be incorrect',
    '- Your OAuth token may have expired',
    '- Your account may not have access to this resource',
    '',
    'Fix: Check your Paraşüt credentials and try again.',
    '',
    'Required environment variables:',
    '- PARASUT_COMPANY_ID',
    '- PARASUT_CLIENT_ID',
    '- PARASUT_CLIENT_SECRET',
    '- PARASUT_USERNAME',
    '- PARASUT_PASSWORD',
  ];

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
  };
}

function handleRateLimitError(error: ParasutRateLimitError): ToolResponse {
  const retryAfterMs = error.retryAfterMs ?? 10000;
  const retryAfter = Math.ceil(retryAfterMs / 1000);

  const parts: string[] = [
    'Error: Rate limit exceeded.',
    '',
    `Limit: The API allows 10 requests per 10 seconds.`,
    `Retry in: ${retryAfter} seconds`,
    '',
    'Recommendation:',
    '- Wait a few seconds before retrying',
    '- Consider batching multiple operations',
    '- Use search filters to reduce the number of requests',
  ];

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
    metadata: {
      error_code: 'RATE_LIMITED',
      recoverable: true,
      retry_after_ms: retryAfterMs,
    } as ErrorMetadata,
  };
}

function handleNetworkError(error: ParasutNetworkError): ToolResponse {
  const parts: string[] = [
    'Error: Network connection failed.',
    '',
    'Possible causes:',
    '- No internet connection',
    '- Paraşüt API is temporarily unavailable',
    '- DNS resolution failed',
    '',
    'Fix: Check your internet connection and try again.',
    '',
    'If the problem persists:',
    '- Check https://status.parasut.com for service status',
    '- Try again in a few minutes',
  ];

  if (error.cause) {
    parts.push('', `Technical details: ${String(error.cause)}`);
  }

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
  };
}

function handleApiError(
  error: ParasutApiError,
  context?: { operation?: string }
): ToolResponse {
  const operation = context?.operation ?? 'API request';

  const parts: string[] = [
    `Error: ${operation} failed (HTTP ${error.status}).`,
    '',
  ];

  if (error.errors?.length) {
    parts.push('Details:');
    for (const err of error.errors) {
      parts.push(`- ${err.title}: ${err.detail}`);
    }
  } else {
    parts.push(`Status: ${error.status}`);
    parts.push(`Message: ${error.message}`);
  }

  parts.push('', 'If this error persists, check:');
  parts.push('- The resource IDs are correct');
  parts.push('- You have the necessary permissions');
  parts.push('- The data format matches the API requirements');

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
  };
}

function handleUnknownError(
  error: unknown,
  context?: { operation?: string }
): ToolResponse {
  const operation = context?.operation ?? 'Operation';
  const message =
    error instanceof Error ? error.message : 'An unknown error occurred';

  const parts: string[] = [
    `Error: ${operation} failed unexpectedly.`,
    '',
    `Details: ${message}`,
    '',
    'This may be a bug. If the problem persists:',
    '- Check the parameters are correct',
    '- Try the operation again',
    '- Report the issue if it continues',
  ];

  return {
    content: [{ type: 'text', text: parts.join('\n') }],
    isError: true,
  };
}

/**
 * Wraps an async handler with error handling.
 * Converts all errors to proper MCP tool responses.
 */
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  context?: { operation?: string; resourceType?: string }
): (...args: T) => Promise<R | ToolResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (err) {
      return handleError(err, context);
    }
  };
}
