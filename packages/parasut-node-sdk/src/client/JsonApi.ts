/**
 * JSON:API Helpers
 *
 * Utilities for building and parsing JSON:API formatted payloads.
 * Follows the JSON:API specification: https://jsonapi.org/
 */

import type {
  JsonApiResource,
  JsonApiResponse,
  JsonApiListResponse,
  Relationship,
  RelationshipMany,
} from '../generated/types.js';

// ============================================================================
// Types
// ============================================================================

export interface ResourceIdentifier {
  id: string;
  type: string;
}

export interface CreateResourceInput<TAttributes = object> {
  type: string;
  attributes: TAttributes;
  relationships?: Record<string, unknown>;
}

export interface UpdateResourceInput<TAttributes = object> {
  id: string;
  type: string;
  attributes?: Partial<TAttributes>;
  relationships?: Record<string, unknown>;
}

export type RelationshipInput =
  | ResourceIdentifier
  | ResourceIdentifier[]
  | null;

// ============================================================================
// Resource Building
// ============================================================================

/**
 * Builds a JSON:API resource object for creation.
 * The id should be empty or omitted for new resources.
 */
export function buildResource<TAttributes>(
  type: string,
  attributes: TAttributes,
  relationships?: Record<string, RelationshipInput>
): { data: CreateResourceInput<TAttributes> } {
  const data: CreateResourceInput<TAttributes> = {
    type,
    attributes,
  };

  if (relationships) {
    data.relationships = formatRelationships(relationships);
  }

  return { data };
}

/**
 * Builds a JSON:API resource object for update.
 */
export function buildUpdateResource<TAttributes>(
  id: string,
  type: string,
  attributes?: Partial<TAttributes>,
  relationships?: Record<string, RelationshipInput>
): { data: UpdateResourceInput<TAttributes> } {
  const data: UpdateResourceInput<TAttributes> = {
    id,
    type,
  };

  if (attributes && Object.keys(attributes).length > 0) {
    data.attributes = attributes;
  }

  if (relationships) {
    data.relationships = formatRelationships(relationships);
  }

  return { data };
}

/**
 * Formats relationship inputs into JSON:API format.
 */
function formatRelationships(
  input: Record<string, RelationshipInput>
): Record<string, Relationship | RelationshipMany> {
  const result: Record<string, Relationship | RelationshipMany> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === null) {
      result[key] = { data: null };
    } else if (Array.isArray(value)) {
      result[key] = {
        data: value.map((v) => ({ id: v.id, type: v.type })),
      };
    } else {
      result[key] = {
        data: { id: value.id, type: value.type },
      };
    }
  }

  return result;
}

// ============================================================================
// Relationship Helpers
// ============================================================================

/**
 * Creates a single relationship reference.
 */
export function rel(type: string, id: string | number): ResourceIdentifier {
  return { type, id: String(id) };
}

/**
 * Creates multiple relationship references.
 */
export function relMany(
  type: string,
  ids: (string | number)[]
): ResourceIdentifier[] {
  return ids.map((id) => ({ type, id: String(id) }));
}

/**
 * Creates a null relationship (for clearing).
 */
export function relNull(): null {
  return null;
}

// ============================================================================
// Response Parsing
// ============================================================================

/**
 * Extracts the data from a JSON:API response.
 */
export function extractData<T>(response: JsonApiResponse<T>): T {
  return response.data;
}

/**
 * Extracts the data array from a list response.
 */
export function extractListData<T>(response: JsonApiListResponse<T>): T[] {
  return response.data;
}

/**
 * Finds an included resource by type and id.
 */
export function findIncluded<T extends JsonApiResource>(
  response: { included?: JsonApiResource[] },
  type: string,
  id: string
): T | undefined {
  return response.included?.find(
    (r) => r.type === type && r.id === id
  ) as T | undefined;
}

/**
 * Finds all included resources of a specific type.
 */
export function findAllIncluded<T extends JsonApiResource>(
  response: { included?: JsonApiResource[] },
  type: string
): T[] {
  return (response.included?.filter((r) => r.type === type) ?? []) as T[];
}

/**
 * Gets the related resource from a relationship.
 * Returns the resource from included if available, otherwise just the identifier.
 */
export function getRelated<T extends JsonApiResource>(
  response: { included?: JsonApiResource[] },
  relationship: Relationship | undefined
): T | ResourceIdentifier | null {
  if (!relationship?.data) {
    return null;
  }

  const { id, type } = relationship.data;
  const included = findIncluded<T>(response, type, id);

  return included ?? { id, type };
}

/**
 * Gets all related resources from a to-many relationship.
 */
export function getRelatedMany<T extends JsonApiResource>(
  response: { included?: JsonApiResource[] },
  relationship: RelationshipMany | undefined
): (T | ResourceIdentifier)[] {
  if (!relationship?.data || !Array.isArray(relationship.data)) {
    return [];
  }

  return relationship.data.map(({ id, type }) => {
    const included = findIncluded<T>(response, type, id);
    return included ?? { id, type };
  });
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Checks if a value is a full resource (not just an identifier).
 */
export function isFullResource<T extends JsonApiResource>(
  value: T | ResourceIdentifier
): value is T {
  return 'attributes' in value;
}

/**
 * Checks if a response has included resources.
 */
export function hasIncluded(
  response: { included?: unknown[] }
): response is { included: JsonApiResource[] } {
  return Array.isArray(response.included) && response.included.length > 0;
}

// ============================================================================
// Denormalization (Experimental)
// ============================================================================

export interface DenormalizedResource<
  TAttributes = Record<string, unknown>,
  TRelationships = Record<string, unknown>
> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships: TRelationships;
}

/**
 * Denormalizes a JSON:API response by embedding related resources.
 * This creates a more convenient object structure at the cost of data duplication.
 *
 * @example
 * ```typescript
 * const response = await client.salesInvoices.get(123, { include: ['contact'] });
 * const denormalized = denormalize(response);
 * console.log(denormalized.relationships.contact.attributes.name);
 * ```
 */
export function denormalize<T extends JsonApiResource>(
  response: JsonApiResponse<T>
): T & { _included: Map<string, JsonApiResource> } {
  const includedMap = new Map<string, JsonApiResource>();

  if (response.included) {
    for (const resource of response.included) {
      const key = `${resource.type}:${resource.id}`;
      includedMap.set(key, resource);
    }
  }

  return {
    ...response.data,
    _included: includedMap,
  };
}

/**
 * Creates a lookup map from included resources.
 */
export function createIncludedMap(
  included?: JsonApiResource[]
): Map<string, JsonApiResource> {
  const map = new Map<string, JsonApiResource>();

  if (included) {
    for (const resource of included) {
      const key = `${resource.type}:${resource.id}`;
      map.set(key, resource);
    }
  }

  return map;
}

/**
 * Looks up a resource from the included map.
 */
export function lookupIncluded<T extends JsonApiResource>(
  map: Map<string, JsonApiResource>,
  type: string,
  id: string
): T | undefined {
  return map.get(`${type}:${id}`) as T | undefined;
}
