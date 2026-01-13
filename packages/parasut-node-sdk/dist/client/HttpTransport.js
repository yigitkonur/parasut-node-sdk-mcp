/**
 * HTTP Transport Layer
 *
 * Provides a native fetch wrapper with interceptors, error handling,
 * and JSON:API content type support.
 */
import { createApiError, ParasutNetworkError, ParasutTimeoutError, } from './errors.js';
// ============================================================================
// Query Serialization
// ============================================================================
/**
 * Serializes query parameters into a URL search string.
 * Handles nested bracket notation for JSON:API (filter[name], page[number]).
 */
export function serializeQuery(params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null)
            continue;
        if (Array.isArray(value)) {
            // For include=category,tags format
            searchParams.append(key, value.join(','));
        }
        else {
            searchParams.append(key, String(value));
        }
    }
    const result = searchParams.toString();
    return result ? `?${result}` : '';
}
/**
 * Builds full URL with path and query parameters.
 */
export function buildUrl(baseUrl, path, query) {
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
    config;
    requestInterceptors = [];
    responseInterceptors = [];
    errorInterceptors = [];
    constructor(config) {
        this.config = config;
    }
    /**
     * Adds a request interceptor.
     * Interceptors are called in order before the request is sent.
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    /**
     * Adds a response interceptor.
     * Interceptors are called in order after a successful response.
     */
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    /**
     * Adds an error interceptor.
     * Interceptors are called in order when an error occurs.
     */
    addErrorInterceptor(interceptor) {
        this.errorInterceptors.push(interceptor);
    }
    /**
     * Executes a request with all interceptors applied.
     */
    async request(config) {
        let processedConfig = config;
        // Apply request interceptors
        for (const interceptor of this.requestInterceptors) {
            processedConfig = await interceptor(processedConfig);
        }
        try {
            const response = await this.executeRequest(processedConfig);
            return response;
        }
        catch (error) {
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
    async executeRequest(config) {
        const timeout = config.timeout ?? this.config.timeout;
        const url = buildUrl(this.config.baseUrl, config.path, config.query);
        // Prepare headers
        const headers = {
            Accept: 'application/vnd.api+json',
            ...this.config.headers,
            ...config.headers,
        };
        // Add content-type for requests with body
        if (config.body !== undefined && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/vnd.api+json';
        }
        // Prepare request options
        const fetchOptions = {
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
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                // Handle abort/timeout
                if (error.name === 'AbortError') {
                    throw new ParasutTimeoutError(timeout);
                }
                // Handle network errors
                if (error.name === 'TypeError' || error.message.includes('fetch')) {
                    throw new ParasutNetworkError(`Network request failed: ${error.message}`, 'NETWORK_ERROR', error);
                }
            }
            throw error;
        }
    }
    /**
     * Handles the response, parsing JSON and handling errors.
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type') ?? '';
        const requestId = response.headers.get('x-request-id') ?? undefined;
        // Handle 204 No Content
        if (response.status === 204) {
            return { status: 204, noContent: true };
        }
        // Parse response body
        let body;
        let rawBody;
        if (contentType.includes('application/json') || contentType.includes('application/vnd.api+json')) {
            rawBody = await response.text();
            try {
                body = JSON.parse(rawBody);
            }
            catch {
                body = rawBody;
            }
        }
        else {
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
    async get(path, query, options) {
        return this.request({
            method: 'GET',
            path,
            ...(query !== undefined && { query }),
            ...options,
        });
    }
    /**
     * Convenience method for POST requests.
     */
    async post(path, body, options) {
        return this.request({
            method: 'POST',
            path,
            body,
            ...options,
        });
    }
    /**
     * Convenience method for PATCH requests.
     */
    async patch(path, body, options) {
        return this.request({
            method: 'PATCH',
            path,
            body,
            ...options,
        });
    }
    /**
     * Convenience method for PUT requests.
     */
    async put(path, body, options) {
        return this.request({
            method: 'PUT',
            path,
            body,
            ...options,
        });
    }
    /**
     * Convenience method for DELETE requests.
     */
    async delete(path, options) {
        return this.request({
            method: 'DELETE',
            path,
            ...options,
        });
    }
}
//# sourceMappingURL=HttpTransport.js.map