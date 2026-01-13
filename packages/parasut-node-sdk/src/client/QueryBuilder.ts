/**
 * Query Builder
 *
 * Type-safe query parameter serialization for Paraşüt API.
 * Handles JSON:API filter[key], page[number], include, and sort formats.
 */

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Serialization
// ============================================================================

/**
 * Serializes a value to a string for query parameters.
 */
function serializeValue(value: unknown): string | undefined {
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
export function buildListQuery<TFilters extends object = object>(
  params: ListQueryParams<TFilters>
): Record<string, string> {
  const query: Record<string, string> = {};

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
export function buildShowQuery(params: ShowQueryParams): Record<string, string> {
  const query: Record<string, string> = {};

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
export class QueryBuilder<TFilters extends object = object> {
  private params: ListQueryParams<TFilters> = {};

  /**
   * Adds a filter parameter.
   */
  filter<K extends keyof TFilters>(
    key: K,
    value: TFilters[K]
  ): this {
    if (!this.params.filter) {
      this.params.filter = {} as TFilters;
    }
    (this.params.filter as Record<string, unknown>)[key as string] = value;
    return this;
  }

  /**
   * Adds multiple filter parameters.
   */
  filters(filters: Partial<TFilters>): this {
    this.params.filter = { ...this.params.filter, ...filters } as TFilters;
    return this;
  }

  /**
   * Sets the page number.
   */
  pageNumber(num: number): this {
    if (!this.params.page) {
      this.params.page = {};
    }
    this.params.page.number = num;
    return this;
  }

  /**
   * Sets the page size.
   */
  pageSize(size: number): this {
    if (!this.params.page) {
      this.params.page = {};
    }
    this.params.page.size = size;
    return this;
  }

  /**
   * Sets both page number and size.
   */
  page(number: number, size?: number): this {
    this.params.page = size !== undefined ? { number, size } : { number };
    return this;
  }

  /**
   * Adds resources to include.
   */
  include(...resources: string[]): this {
    const current = this.params.include;
    if (Array.isArray(current)) {
      this.params.include = [...current, ...resources];
    } else if (current) {
      this.params.include = [current, ...resources];
    } else {
      this.params.include = resources;
    }
    return this;
  }

  /**
   * Sets the sort order.
   * Prefix with '-' for descending.
   */
  sort(...fields: string[]): this {
    this.params.sort = fields;
    return this;
  }

  /**
   * Sorts by field in ascending order.
   */
  sortAsc(field: string): this {
    return this.sort(field);
  }

  /**
   * Sorts by field in descending order.
   */
  sortDesc(field: string): this {
    return this.sort(`-${field}`);
  }

  /**
   * Builds the query parameters.
   */
  build(): Record<string, string> {
    return buildListQuery(this.params);
  }

  /**
   * Returns the raw params object.
   */
  getParams(): ListQueryParams<TFilters> {
    return this.params;
  }

  /**
   * Resets the builder.
   */
  reset(): this {
    this.params = {};
    return this;
  }
}

/**
 * Creates a new query builder.
 */
export function query<TFilters extends object = object>(): QueryBuilder<TFilters> {
  return new QueryBuilder<TFilters>();
}
