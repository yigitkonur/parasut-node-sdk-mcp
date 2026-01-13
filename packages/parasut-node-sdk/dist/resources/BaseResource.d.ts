/**
 * Base Resource
 *
 * Abstract base class for all API resources.
 * Provides common CRUD operations and pagination helpers.
 */
import type { HttpTransport } from '../client/HttpTransport.js';
import type { ListQueryParams, ShowQueryParams } from '../client/QueryBuilder.js';
import type { JsonApiResource, JsonApiResponse, ListMeta } from '../generated/types.js';
export interface ResourceConfig {
    transport: HttpTransport;
    companyId: number;
    basePath: string;
    resourceType: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: ListMeta;
    included?: JsonApiResource[];
}
export interface IterateOptions {
    pageSize?: number;
    maxPages?: number;
}
export declare abstract class BaseResource<TResource extends JsonApiResource = JsonApiResource, TAttributes = object, TFilters extends object = object> {
    protected readonly transport: HttpTransport;
    protected readonly companyId: number;
    protected readonly basePath: string;
    protected readonly resourceType: string;
    constructor(config: ResourceConfig);
    /**
     * Builds the full path for a resource.
     */
    protected buildPath(id?: string | number, suffix?: string): string;
    /**
     * Lists resources with pagination and filtering.
     */
    list(params?: ListQueryParams<TFilters>): Promise<PaginatedResponse<TResource>>;
    /**
     * Gets a single resource by ID.
     */
    get(id: string | number, params?: ShowQueryParams): Promise<JsonApiResponse<TResource>>;
    /**
     * Creates a new resource.
     */
    create(payload: {
        data: {
            type: string;
            attributes: TAttributes;
            relationships?: Record<string, unknown>;
        };
    }): Promise<JsonApiResponse<TResource>>;
    /**
     * Updates an existing resource.
     */
    update(id: string | number, payload: {
        data: {
            id: string;
            type: string;
            attributes?: Partial<TAttributes>;
            relationships?: Record<string, unknown>;
        };
    }): Promise<JsonApiResponse<TResource>>;
    /**
     * Deletes a resource.
     */
    delete(id: string | number): Promise<void>;
    /**
     * Async iterator for paginating through all resources.
     * Yields individual resources one at a time.
     *
     * @example
     * ```typescript
     * for await (const contact of client.contacts.iterate({ pageSize: 25 })) {
     *   console.log(contact.attributes.name);
     * }
     * ```
     */
    iterate(params?: ListQueryParams<TFilters> & IterateOptions): AsyncGenerator<TResource, void, undefined>;
    /**
     * Fetches all resources matching the query.
     * Use with caution for large datasets.
     *
     * @example
     * ```typescript
     * const allContacts = await client.contacts.listAll({
     *   filter: { account_type: 'customer' }
     * });
     * ```
     */
    listAll(params?: ListQueryParams<TFilters> & IterateOptions): Promise<TResource[]>;
    /**
     * Counts resources matching the query.
     * Makes a single request to get the total_count from meta.
     */
    count(params?: Omit<ListQueryParams<TFilters>, 'page'>): Promise<number>;
    /**
     * Checks if any resources exist matching the query.
     */
    exists(params?: Omit<ListQueryParams<TFilters>, 'page'>): Promise<boolean>;
    /**
     * Gets the first resource matching the query.
     */
    first(params?: Omit<ListQueryParams<TFilters>, 'page'>): Promise<TResource | null>;
}
/**
 * Mixin for resources that support archive/unarchive.
 */
export interface Archivable<T> {
    archive(id: string | number): Promise<JsonApiResponse<T>>;
    unarchive(id: string | number): Promise<JsonApiResponse<T>>;
}
/**
 * Mixin for resources that support cancel/recover.
 */
export interface Cancellable<T> {
    cancel(id: string | number): Promise<JsonApiResponse<T>>;
    recover(id: string | number): Promise<JsonApiResponse<T>>;
}
/**
 * Mixin for resources that support payments.
 */
export interface Payable<T> {
    pay(id: string | number, payload: {
        data: {
            type: string;
            attributes: Record<string, unknown>;
        };
    }): Promise<JsonApiResponse<T>>;
}
/**
 * Mixin for resources that have PDF endpoints.
 */
export interface HasPdf {
    pdf(id: string | number, options?: {
        pollInterval?: number;
        timeout?: number;
    }): Promise<{
        url: string;
        expiresAt: Date;
    }>;
}
//# sourceMappingURL=BaseResource.d.ts.map