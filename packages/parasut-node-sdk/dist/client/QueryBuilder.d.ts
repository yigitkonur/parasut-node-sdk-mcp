/**
 * Query Builder
 *
 * Type-safe query parameter serialization for Paraşüt API.
 * Handles JSON:API filter[key], page[number], include, and sort formats.
 */
export interface PageParams {
    /**
     * Page number (1-indexed)
     * @default 1
     */
    number?: number;
    /**
     * Number of items per page
     * @default 15
     * @max 25
     */
    size?: number;
}
export interface ListQueryParams<TFilters = object> {
    /**
     * Filter parameters.
     * Keys are converted to filter[key] format.
     */
    filter?: TFilters;
    /**
     * Pagination parameters.
     */
    page?: PageParams;
    /**
     * Related resources to include.
     * Can be a string (comma-separated) or array.
     */
    include?: string | string[];
    /**
     * Sort field(s).
     * Prefix with '-' for descending order.
     * Can be a string or array.
     */
    sort?: string | string[];
}
export interface ShowQueryParams {
    /**
     * Related resources to include.
     */
    include?: string | string[];
}
/**
 * Builds query parameters from list options.
 */
export declare function buildListQuery<TFilters extends object = object>(params: ListQueryParams<TFilters>): Record<string, string>;
/**
 * Builds query parameters for show (single resource) requests.
 */
export declare function buildShowQuery(params: ShowQueryParams): Record<string, string>;
/**
 * Fluent query builder for constructing complex queries.
 */
export declare class QueryBuilder<TFilters extends object = object> {
    private params;
    /**
     * Adds a filter parameter.
     */
    filter<K extends keyof TFilters>(key: K, value: TFilters[K]): this;
    /**
     * Adds multiple filter parameters.
     */
    filters(filters: Partial<TFilters>): this;
    /**
     * Sets the page number.
     */
    pageNumber(num: number): this;
    /**
     * Sets the page size.
     */
    pageSize(size: number): this;
    /**
     * Sets both page number and size.
     */
    page(number: number, size?: number): this;
    /**
     * Adds resources to include.
     */
    include(...resources: string[]): this;
    /**
     * Sets the sort order.
     * Prefix with '-' for descending.
     */
    sort(...fields: string[]): this;
    /**
     * Sorts by field in ascending order.
     */
    sortAsc(field: string): this;
    /**
     * Sorts by field in descending order.
     */
    sortDesc(field: string): this;
    /**
     * Builds the query parameters.
     */
    build(): Record<string, string>;
    /**
     * Returns the raw params object.
     */
    getParams(): ListQueryParams<TFilters>;
    /**
     * Resets the builder.
     */
    reset(): this;
}
/**
 * Creates a new query builder.
 */
export declare function query<TFilters extends object = object>(): QueryBuilder<TFilters>;
//# sourceMappingURL=QueryBuilder.d.ts.map