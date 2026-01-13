/**
 * HTTP Transport Layer
 *
 * Provides a native fetch wrapper with interceptors, error handling,
 * and JSON:API content type support.
 */

import {
  createApiError,
  ParasutNetworkError,
  ParasutTimeoutError,
} from './errors.js';

// ============================================================================
// Types
// ============================================================================

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface TransportConfig {
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
}

export interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

export interface ResponseInterceptor {
  (response: Response, body: unknown): unknown | Promise<unknown>;
}

export interface ErrorInterceptor {
  (error: Error): Error | Promise<Error>;
}

// ============================================================================
// Query Serialization
// ============================================================================

/**
 * Serializes query parameters into a URL search string.
 * Handles nested bracket notation for JSON:API (filter[name], page[number]).
 */
export function serializeQuery(
  params: Record<string, string | number | boolean | string[] | undefined>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      // For include=category,tags format
      searchParams.append(key, value.join(','));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const result = searchParams.toString();
  return result ? `?${result}` : '';
}

/**
 * Builds full URL with path and query parameters.
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  const url = `${baseUrl}${path}`;
  if (!query || Object.keys(query).length === 0) {
    return url;
  }
  return url + serializeQuery(query);
}

// ============================================================================
// HTTP Transport
// ============================================================================

export class HttpTransport {
  private config: TransportConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: TransportConfig) {
    this.config = config;
  }

  /**
   * Adds a request interceptor.
   * Interceptors are called in order before the request is sent.
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Adds a response interceptor.
   * Interceptors are called in order after a successful response.
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Adds an error interceptor.
   * Interceptors are called in order when an error occurs.
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Executes a request with all interceptors applied.
   */
  async request<T = unknown>(config: RequestConfig): Promise<T> {
    let processedConfig = config;

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }

    try {
      const response = await this.executeRequest(processedConfig);
      return response as T;
    } catch (error) {
      // Apply error interceptors
      let processedError = error instanceof Error ? error : new Error(String(error));
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }
      throw processedError;
    }
  }

  /**
   * Executes the actual HTTP request.
   */
  private async executeRequest(config: RequestConfig): Promise<unknown> {
    const timeout = config.timeout ?? this.config.timeout;
    const url = buildUrl(this.config.baseUrl, config.path, config.query);

    // Prepare headers
    const headers: Record<string, string> = {
      Accept: 'application/vnd.api+json',
      ...this.config.headers,
      ...config.headers,
    };

    // Add content-type for requests with body
    if (config.body !== undefined && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/vnd.api+json';
    }

    // Prepare request options
    const fetchOptions: RequestInit = {
      method: config.method,
      headers,
    };

    if (config.body !== undefined) {
      fetchOptions.body = JSON.stringify(config.body);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        // Handle abort/timeout
        if (error.name === 'AbortError') {
          throw new ParasutTimeoutError(timeout);
        }

        // Handle network errors
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          throw new ParasutNetworkError(
            `Network request failed: ${error.message}`,
            'NETWORK_ERROR',
            error
          );
        }
      }

      throw error;
    }
  }

  /**
   * Handles the response, parsing JSON and handling errors.
   */
  private async handleResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';
    const requestId = response.headers.get('x-request-id') ?? undefined;

    // Handle 204 No Content
    if (response.status === 204) {
      return { status: 204, noContent: true };
    }

    // Parse response body
    let body: unknown;
    let rawBody: string | undefined;

    if (contentType.includes('application/json') || contentType.includes('application/vnd.api+json')) {
      rawBody = await response.text();
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = rawBody;
      }
    } else {
      rawBody = await response.text();
      body = rawBody;
    }

    // Check for error status codes
    if (!response.ok) {
      throw createApiError(response.status, body, requestId, rawBody);
    }

    // Apply response interceptors
    let result = body;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(response, result);
    }

    return result;
  }

  /**
   * Convenience method for GET requests.
   */
  async get<T = unknown>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
    options?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'GET',
      path,
      ...(query !== undefined && { query }),
      ...options,
    });
  }

  /**
   * Convenience method for POST requests.
   */
  async post<T = unknown>(
    path: string,
    body?: unknown,
    options?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      path,
      body,
      ...options,
    });
  }

  /**
   * Convenience method for PATCH requests.
   */
  async patch<T = unknown>(
    path: string,
    body?: unknown,
    options?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      path,
      body,
      ...options,
    });
  }

  /**
   * Convenience method for PUT requests.
   */
  async put<T = unknown>(
    path: string,
    body?: unknown,
    options?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      path,
      body,
      ...options,
    });
  }

  /**
   * Convenience method for DELETE requests.
   */
  async delete<T = unknown>(
    path: string,
    options?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      path,
      ...options,
    });
  }
}
