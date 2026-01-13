/**
 * Query Builder
 *
 * Type-safe query parameter serialization for Paraşüt API.
 * Handles JSON:API filter[key], page[number], include, and sort formats.
 */
// ============================================================================
// Serialization
// ============================================================================
/**
 * Serializes a value to a string for query parameters.
 */
function serializeValue(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
        return String(value);
    }
    if (typeof value === 'string') {
        return value;
    }
    if (value instanceof Date) {
        return value.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
    if (Array.isArray(value)) {
        return value.map(String).join(',');
    }
    return String(value);
}
/**
 * Builds query parameters from list options.
 */
export function buildListQuery(params) {
    const query = {};
    // Add filter parameters
    if (params.filter) {
        for (const [key, value] of Object.entries(params.filter)) {
            const serialized = serializeValue(value);
            if (serialized !== undefined) {
                query[`filter[${key}]`] = serialized;
            }
        }
    }
    // Add pagination parameters
    if (params.page) {
        if (params.page.number !== undefined) {
            query['page[number]'] = String(params.page.number);
        }
        if (params.page.size !== undefined) {
            query['page[size]'] = String(Math.min(params.page.size, 25)); // Max 25
        }
    }
    // Add include parameter
    if (params.include) {
        const includeValue = Array.isArray(params.include)
            ? params.include.join(',')
            : params.include;
        if (includeValue) {
            query['include'] = includeValue;
        }
    }
    // Add sort parameter
    if (params.sort) {
        const sortValue = Array.isArray(params.sort)
            ? params.sort.join(',')
            : params.sort;
        if (sortValue) {
            query['sort'] = sortValue;
        }
    }
    return query;
}
/**
 * Builds query parameters for show (single resource) requests.
 */
export function buildShowQuery(params) {
    const query = {};
    if (params.include) {
        const includeValue = Array.isArray(params.include)
            ? params.include.join(',')
            : params.include;
        if (includeValue) {
            query['include'] = includeValue;
        }
    }
    return query;
}
// ============================================================================
// Fluent Query Builder (Optional)
// ============================================================================
/**
 * Fluent query builder for constructing complex queries.
 */
export class QueryBuilder {
    params = {};
    /**
     * Adds a filter parameter.
     */
    filter(key, value) {
        if (!this.params.filter) {
            this.params.filter = {};
        }
        this.params.filter[key] = value;
        return this;
    }
    /**
     * Adds multiple filter parameters.
     */
    filters(filters) {
        this.params.filter = { ...this.params.filter, ...filters };
        return this;
    }
    /**
     * Sets the page number.
     */
    pageNumber(num) {
        if (!this.params.page) {
            this.params.page = {};
        }
        this.params.page.number = num;
        return this;
    }
    /**
     * Sets the page size.
     */
    pageSize(size) {
        if (!this.params.page) {
            this.params.page = {};
        }
        this.params.page.size = size;
        return this;
    }
    /**
     * Sets both page number and size.
     */
    page(number, size) {
        this.params.page = size !== undefined ? { number, size } : { number };
        return this;
    }
    /**
     * Adds resources to include.
     */
    include(...resources) {
        const current = this.params.include;
        if (Array.isArray(current)) {
            this.params.include = [...current, ...resources];
        }
        else if (current) {
            this.params.include = [current, ...resources];
        }
        else {
            this.params.include = resources;
        }
        return this;
    }
    /**
     * Sets the sort order.
     * Prefix with '-' for descending.
     */
    sort(...fields) {
        this.params.sort = fields;
        return this;
    }
    /**
     * Sorts by field in ascending order.
     */
    sortAsc(field) {
        return this.sort(field);
    }
    /**
     * Sorts by field in descending order.
     */
    sortDesc(field) {
        return this.sort(`-${field}`);
    }
    /**
     * Builds the query parameters.
     */
    build() {
        return buildListQuery(this.params);
    }
    /**
     * Returns the raw params object.
     */
    getParams() {
        return this.params;
    }
    /**
     * Resets the builder.
     */
    reset() {
        this.params = {};
        return this;
    }
}
/**
 * Creates a new query builder.
 */
export function query() {
    return new QueryBuilder();
}
//# sourceMappingURL=QueryBuilder.js.map