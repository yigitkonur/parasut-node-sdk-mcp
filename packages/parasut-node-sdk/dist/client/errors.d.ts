/**
 * Base error class for all Paraşüt SDK errors.
 */
export declare class ParasutError extends Error {
    readonly cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
/**
 * Represents an API error returned by Paraşüt in JSON:API format.
 */
export interface ApiErrorDetail {
    title: string;
    detail: string;
}
/**
 * Error thrown when the Paraşüt API returns an error response.
 */
export declare class ParasutApiError extends ParasutError {
    readonly status: number;
    readonly errors: ApiErrorDetail[];
    readonly requestId?: string | undefined;
    readonly rawBody?: string | undefined;
    constructor(message: string, status: number, errors: ApiErrorDetail[], requestId?: string | undefined, rawBody?: string | undefined);
    /**
     * Returns a formatted string of all error details.
     */
    get errorDetails(): string;
}
/**
 * Error thrown when authentication fails (401 Unauthorized).
 */
export declare class ParasutAuthError extends ParasutApiError {
    constructor(errors: ApiErrorDetail[], requestId?: string, rawBody?: string);
}
/**
 * Error thrown when the request is forbidden (403 Forbidden).
 */
export declare class ParasutForbiddenError extends ParasutApiError {
    constructor(errors: ApiErrorDetail[], requestId?: string, rawBody?: string);
}
/**
 * Error thrown when a resource is not found (404 Not Found).
 */
export declare class ParasutNotFoundError extends ParasutApiError {
    constructor(errors: ApiErrorDetail[], requestId?: string, rawBody?: string);
}
/**
 * Error thrown when validation fails (422 Unprocessable Entity).
 */
export declare class ParasutValidationError extends ParasutApiError {
    constructor(errors: ApiErrorDetail[], requestId?: string, rawBody?: string);
}
/**
 * Error thrown when rate limit is exceeded (429 Too Many Requests).
 */
export declare class ParasutRateLimitError extends ParasutApiError {
    readonly retryAfterMs?: number | undefined;
    constructor(retryAfterMs?: number | undefined, errors?: ApiErrorDetail[], requestId?: string, rawBody?: string);
}
/**
 * Error thrown when a network error occurs (connection failures, timeouts, etc.).
 */
export declare class ParasutNetworkError extends ParasutError {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined, cause?: unknown);
}
/**
 * Error thrown when request times out.
 */
export declare class ParasutTimeoutError extends ParasutNetworkError {
    constructor(timeoutMs: number, cause?: unknown);
}
/**
 * Error thrown when there's an issue with the SDK configuration.
 */
export declare class ParasutConfigError extends ParasutError {
    constructor(message: string);
}
/**
 * Parses an error response body into ApiErrorDetail array.
 */
export declare function parseApiErrors(body: unknown): ApiErrorDetail[];
/**
 * Creates the appropriate error class based on HTTP status code.
 */
export declare function createApiError(status: number, body: unknown, requestId?: string, rawBody?: string): ParasutApiError;
//# sourceMappingURL=errors.d.ts.map