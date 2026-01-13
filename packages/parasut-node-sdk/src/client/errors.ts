/**
 * Base error class for all Paraşüt SDK errors.
 */
export class ParasutError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ParasutError';
    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
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
export class ParasutApiError extends ParasutError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: ApiErrorDetail[],
    public readonly requestId?: string,
    public readonly rawBody?: string
  ) {
    super(message);
    this.name = 'ParasutApiError';
  }

  /**
   * Returns a formatted string of all error details.
   */
  get errorDetails(): string {
    return this.errors.map((e) => `${e.title}: ${e.detail}`).join('; ');
  }
}

/**
 * Error thrown when authentication fails (401 Unauthorized).
 */
export class ParasutAuthError extends ParasutApiError {
  constructor(
    errors: ApiErrorDetail[],
    requestId?: string,
    rawBody?: string
  ) {
    super('Authentication failed', 401, errors, requestId, rawBody);
    this.name = 'ParasutAuthError';
  }
}

/**
 * Error thrown when the request is forbidden (403 Forbidden).
 */
export class ParasutForbiddenError extends ParasutApiError {
  constructor(
    errors: ApiErrorDetail[],
    requestId?: string,
    rawBody?: string
  ) {
    super('Access forbidden', 403, errors, requestId, rawBody);
    this.name = 'ParasutForbiddenError';
  }
}

/**
 * Error thrown when a resource is not found (404 Not Found).
 */
export class ParasutNotFoundError extends ParasutApiError {
  constructor(
    errors: ApiErrorDetail[],
    requestId?: string,
    rawBody?: string
  ) {
    super('Resource not found', 404, errors, requestId, rawBody);
    this.name = 'ParasutNotFoundError';
  }
}

/**
 * Error thrown when validation fails (422 Unprocessable Entity).
 */
export class ParasutValidationError extends ParasutApiError {
  constructor(
    errors: ApiErrorDetail[],
    requestId?: string,
    rawBody?: string
  ) {
    super('Validation failed', 422, errors, requestId, rawBody);
    this.name = 'ParasutValidationError';
  }
}

/**
 * Error thrown when rate limit is exceeded (429 Too Many Requests).
 */
export class ParasutRateLimitError extends ParasutApiError {
  constructor(
    public readonly retryAfterMs?: number,
    errors: ApiErrorDetail[] = [{ title: 'Rate Limited', detail: 'Too many requests' }],
    requestId?: string,
    rawBody?: string
  ) {
    super('Rate limit exceeded', 429, errors, requestId, rawBody);
    this.name = 'ParasutRateLimitError';
  }
}

/**
 * Error thrown when a network error occurs (connection failures, timeouts, etc.).
 */
export class ParasutNetworkError extends ParasutError {
  constructor(
    message: string,
    public readonly code?: string,
    cause?: unknown
  ) {
    super(message, cause);
    this.name = 'ParasutNetworkError';
  }
}

/**
 * Error thrown when request times out.
 */
export class ParasutTimeoutError extends ParasutNetworkError {
  constructor(timeoutMs: number, cause?: unknown) {
    super(`Request timed out after ${timeoutMs}ms`, 'TIMEOUT', cause);
    this.name = 'ParasutTimeoutError';
  }
}

/**
 * Error thrown when there's an issue with the SDK configuration.
 */
export class ParasutConfigError extends ParasutError {
  constructor(message: string) {
    super(message);
    this.name = 'ParasutConfigError';
  }
}

/**
 * Parses an error response body into ApiErrorDetail array.
 */
export function parseApiErrors(body: unknown): ApiErrorDetail[] {
  if (
    typeof body === 'object' &&
    body !== null &&
    'errors' in body &&
    Array.isArray((body as { errors: unknown }).errors)
  ) {
    const errors = (body as { errors: unknown[] }).errors;
    return errors
      .filter(
        (e): e is { title?: string; detail?: string } =>
          typeof e === 'object' && e !== null
      )
      .map((e) => ({
        title: String(e.title ?? 'Error'),
        detail: String(e.detail ?? 'Unknown error'),
      }));
  }
  return [{ title: 'Error', detail: 'Unknown error occurred' }];
}

/**
 * Creates the appropriate error class based on HTTP status code.
 */
export function createApiError(
  status: number,
  body: unknown,
  requestId?: string,
  rawBody?: string
): ParasutApiError {
  const errors = parseApiErrors(body);

  switch (status) {
    case 401:
      return new ParasutAuthError(errors, requestId, rawBody);
    case 403:
      return new ParasutForbiddenError(errors, requestId, rawBody);
    case 404:
      return new ParasutNotFoundError(errors, requestId, rawBody);
    case 422:
      return new ParasutValidationError(errors, requestId, rawBody);
    case 429:
      return new ParasutRateLimitError(undefined, errors, requestId, rawBody);
    default:
      return new ParasutApiError(
        `API request failed with status ${status}`,
        status,
        errors,
        requestId,
        rawBody
      );
  }
}
