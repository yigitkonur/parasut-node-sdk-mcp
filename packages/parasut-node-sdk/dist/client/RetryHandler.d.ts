/**
 * Retry Handler
 *
 * Implements exponential backoff with jitter for transient errors.
 */
export interface RetryConfig {
    /**
     * Whether retry is enabled.
     * @default true
     */
    enabled: boolean;
    /**
     * Maximum number of retry attempts.
     * @default 3
     */
    maxRetries: number;
    /**
     * Initial delay before first retry in milliseconds.
     * @default 100
     */
    initialDelayMs: number;
    /**
     * Maximum delay between retries in milliseconds.
     * @default 10000
     */
    maxDelayMs: number;
    /**
     * Multiplier for exponential backoff.
     * @default 2
     */
    backoffMultiplier: number;
    /**
     * HTTP status codes that should trigger a retry.
     * @default [408, 429, 500, 502, 503, 504]
     */
    retryableStatuses: number[];
    /**
     * HTTP methods that can be retried (idempotent methods).
     * @default ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']
     */
    retryableMethods: string[];
}
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
export interface RetryContext {
    attempt: number;
    method: string;
    path: string;
    error?: Error;
}
export interface RetryHook {
    (context: RetryContext): void | Promise<void>;
}
/**
 * Retry Handler with exponential backoff and jitter.
 */
export declare class RetryHandler {
    private readonly config;
    private readonly hooks;
    constructor(config?: Partial<RetryConfig>);
    /**
     * Adds a hook that's called before each retry attempt.
     */
    onRetry(hook: RetryHook): void;
    /**
     * Executes a function with retry logic.
     */
    execute<T>(fn: () => Promise<T>, context: {
        method: string;
        path: string;
    }): Promise<T>;
    /**
     * Determines if an error should trigger a retry.
     */
    private shouldRetry;
    /**
     * Calculates the delay before the next retry.
     */
    private calculateDelay;
    /**
     * Sleeps for the specified duration.
     */
    private sleep;
}
/**
 * Creates a simple retry wrapper function.
 */
export declare function withRetry<T>(fn: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
//# sourceMappingURL=RetryHandler.d.ts.map