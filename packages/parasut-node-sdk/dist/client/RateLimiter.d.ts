/**
 * Rate Limiter
 *
 * Implements token bucket algorithm for rate limiting requests.
 * Paraşüt API allows 10 requests per 10 seconds.
 */
export interface RateLimitConfig {
    /**
     * Whether rate limiting is enabled.
     * @default true
     */
    enabled: boolean;
    /**
     * Maximum number of requests allowed per window.
     * @default 10
     */
    requestsPerWindow: number;
    /**
     * Time window in milliseconds.
     * @default 10000 (10 seconds)
     */
    windowMs: number;
}
export declare const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig;
/**
 * Token Bucket Rate Limiter
 *
 * Uses a token bucket algorithm where tokens are replenished over time.
 * When a request is made, a token is consumed. If no tokens are available,
 * the request waits until a token becomes available.
 */
export declare class RateLimiter {
    private tokens;
    private lastRefill;
    private readonly config;
    private waitQueue;
    private processing;
    constructor(config?: Partial<RateLimitConfig>);
    /**
     * Acquires a token, waiting if necessary.
     * Returns a promise that resolves when a token is available.
     */
    acquire(): Promise<void>;
    /**
     * Refills tokens based on elapsed time since last refill.
     */
    private refillTokens;
    /**
     * Processes the wait queue, releasing waiters as tokens become available.
     */
    private processQueue;
    /**
     * Calculates time until the next token becomes available.
     */
    private timeUntilNextToken;
    /**
     * Sleeps for the specified duration.
     */
    private sleep;
    /**
     * Returns the current number of available tokens.
     */
    getAvailableTokens(): number;
    /**
     * Returns the current queue length.
     */
    getQueueLength(): number;
    /**
     * Resets the rate limiter to initial state.
     */
    reset(): void;
}
/**
 * Creates a rate limiter middleware for the HTTP transport.
 */
export declare function createRateLimitInterceptor(limiter: RateLimiter): <T>(fn: () => Promise<T>) => Promise<T>;
//# sourceMappingURL=RateLimiter.d.ts.map