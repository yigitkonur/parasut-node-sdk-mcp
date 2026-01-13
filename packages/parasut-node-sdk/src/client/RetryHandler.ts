/**
 * Retry Handler
 *
 * Implements exponential backoff with jitter for transient errors.
 */

import {
  ParasutApiError,
  ParasutNetworkError,
  ParasutRateLimitError,
  ParasutTimeoutError,
} from './errors.js';

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

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  enabled: true,
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 10_000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'],
};

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
export class RetryHandler {
  private readonly config: RetryConfig;
  private readonly hooks: RetryHook[] = [];

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * Adds a hook that's called before each retry attempt.
   */
  onRetry(hook: RetryHook): void {
    this.hooks.push(hook);
  }

  /**
   * Executes a function with retry logic.
   */
  async execute<T>(
    fn: () => Promise<T>,
    context: { method: string; path: string }
  ): Promise<T> {
    if (!this.config.enabled) {
      return fn();
    }

    let lastError: Error | undefined;
    let attempt = 0;

    while (attempt <= this.config.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (!this.shouldRetry(lastError, context.method, attempt)) {
          throw lastError;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = this.calculateDelay(attempt, lastError);

        // Call retry hooks
        const retryContext: RetryContext = {
          attempt,
          method: context.method,
          path: context.path,
          error: lastError,
        };

        for (const hook of this.hooks) {
          await hook(retryContext);
        }

        // Wait before retrying
        await this.sleep(delay);
        attempt++;
      }
    }

    throw lastError!;
  }

  /**
   * Determines if an error should trigger a retry.
   */
  private shouldRetry(error: Error, method: string, attempt: number): boolean {
    // Check if we've exceeded max retries
    if (attempt >= this.config.maxRetries) {
      return false;
    }

    // Check if the method is retryable
    if (!this.config.retryableMethods.includes(method.toUpperCase())) {
      // Special case: always retry rate limit errors regardless of method
      if (error instanceof ParasutRateLimitError) {
        return true;
      }
      return false;
    }

    // Network errors are always retryable
    if (error instanceof ParasutNetworkError || error instanceof ParasutTimeoutError) {
      return true;
    }

    // Check if status code is retryable
    if (error instanceof ParasutApiError) {
      return this.config.retryableStatuses.includes(error.status);
    }

    return false;
  }

  /**
   * Calculates the delay before the next retry.
   */
  private calculateDelay(attempt: number, error: Error): number {
    // If rate limited with retry-after, use that
    if (error instanceof ParasutRateLimitError && error.retryAfterMs) {
      return error.retryAfterMs;
    }

    // Calculate exponential backoff
    const exponentialDelay =
      this.config.initialDelayMs *
      Math.pow(this.config.backoffMultiplier, attempt);

    // Apply max delay cap
    const cappedDelay = Math.min(exponentialDelay, this.config.maxDelayMs);

    // Add jitter (±10%)
    const jitter = cappedDelay * 0.1 * (Math.random() * 2 - 1);

    return Math.round(cappedDelay + jitter);
  }

  /**
   * Sleeps for the specified duration.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Creates a simple retry wrapper function.
 */
export function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const handler = new RetryHandler(config);
  return handler.execute(fn, { method: 'GET', path: '' });
}
