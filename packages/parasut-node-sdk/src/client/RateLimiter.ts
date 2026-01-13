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

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  requestsPerWindow: 10,
  windowMs: 10_000,
};

/**
 * Token Bucket Rate Limiter
 *
 * Uses a token bucket algorithm where tokens are replenished over time.
 * When a request is made, a token is consumed. If no tokens are available,
 * the request waits until a token becomes available.
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly config: RateLimitConfig;
  private waitQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];
  private processing = false;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config };
    this.tokens = this.config.requestsPerWindow;
    this.lastRefill = Date.now();
  }

  /**
   * Acquires a token, waiting if necessary.
   * Returns a promise that resolves when a token is available.
   */
  async acquire(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Refill tokens based on elapsed time
    this.refillTokens();

    // If we have tokens, consume one immediately
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }

    // Otherwise, wait in the queue
    return new Promise<void>((resolve, reject) => {
      this.waitQueue.push({ resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Refills tokens based on elapsed time since last refill.
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;

    if (elapsed >= this.config.windowMs) {
      // Full window has passed, refill all tokens
      this.tokens = this.config.requestsPerWindow;
      this.lastRefill = now;
    } else if (elapsed > 0) {
      // Partial refill based on time elapsed
      const tokensToAdd = Math.floor(
        (elapsed / this.config.windowMs) * this.config.requestsPerWindow
      );

      if (tokensToAdd > 0) {
        this.tokens = Math.min(
          this.tokens + tokensToAdd,
          this.config.requestsPerWindow
        );
        this.lastRefill = now;
      }
    }
  }

  /**
   * Processes the wait queue, releasing waiters as tokens become available.
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.waitQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.waitQueue.length > 0) {
      this.refillTokens();

      if (this.tokens > 0) {
        this.tokens--;
        const waiter = this.waitQueue.shift();
        waiter?.resolve();
      } else {
        // Wait until next token is available
        const waitTime = this.timeUntilNextToken();
        await this.sleep(waitTime);
      }
    }

    this.processing = false;
  }

  /**
   * Calculates time until the next token becomes available.
   */
  private timeUntilNextToken(): number {
    const tokensPerMs = this.config.requestsPerWindow / this.config.windowMs;
    return Math.ceil(1 / tokensPerMs);
  }

  /**
   * Sleeps for the specified duration.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Returns the current number of available tokens.
   */
  getAvailableTokens(): number {
    this.refillTokens();
    return this.tokens;
  }

  /**
   * Returns the current queue length.
   */
  getQueueLength(): number {
    return this.waitQueue.length;
  }

  /**
   * Resets the rate limiter to initial state.
   */
  reset(): void {
    this.tokens = this.config.requestsPerWindow;
    this.lastRefill = Date.now();
    // Reject all waiting requests
    while (this.waitQueue.length > 0) {
      const waiter = this.waitQueue.shift();
      waiter?.reject(new Error('Rate limiter reset'));
    }
  }
}

/**
 * Creates a rate limiter middleware for the HTTP transport.
 */
export function createRateLimitInterceptor(
  limiter: RateLimiter
): <T>(fn: () => Promise<T>) => Promise<T> {
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    await limiter.acquire();
    return fn();
  };
}
