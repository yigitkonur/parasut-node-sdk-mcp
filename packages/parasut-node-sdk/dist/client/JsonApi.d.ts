/**
 * JSON:API Helpers
 *
 * Utilities for building and parsing JSON:API formatted payloads.
 * Follows the JSON:API specification: https://jsonapi.org/
 */
import type { JsonApiResource, JsonApiResponse, JsonApiListResponse, Relationship, RelationshipMany } from '../generated/types.js';
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
export type RelationshipInput = ResourceIdentifier | ResourceIdentifier[] | null;
/**
 * Builds a JSON:API resource object for creation.
 * The id should be empty or omitted for new resources.
 */
export declare function buildResource<TAttributes>(type: string, attributes: TAttributes, relationships?: Record<string, RelationshipInput>): {
    data: CreateResourceInput<TAttributes>;
};
/**
 * Builds a JSON:API resource object for update.
 */
export declare function buildUpdateResource<TAttributes>(id: string, type: string, attributes?: Partial<TAttributes>, relationships?: Record<string, RelationshipInput>): {
    data: UpdateResourceInput<TAttributes>;
};
/**
 * Creates a single relationship reference.
 */
export declare function rel(type: string, id: string | number): ResourceIdentifier;
/**
 * Creates multiple relationship references.
 */
export declare function relMany(type: string, ids: (string | number)[]): ResourceIdentifier[];
/**
 * Creates a null relationship (for clearing).
 */
export declare function relNull(): null;
/**
 * Extracts the data from a JSON:API response.
 */
export declare function extractData<T>(response: JsonApiResponse<T>): T;
/**
 * Extracts the data array from a list response.
 */
export declare function extractListData<T>(response: JsonApiListResponse<T>): T[];
/**
 * Finds an included resource by type and id.
 */
export declare function findIncluded<T extends JsonApiResource>(response: {
    included?: JsonApiResource[];
}, type: string, id: string): T | undefined;
/**
 * Finds all included resources of a specific type.
 */
export declare function findAllIncluded<T extends JsonApiResource>(response: {
    included?: JsonApiResource[];
}, type: string): T[];
/**
 * Gets the related resource from a relationship.
 * Returns the resource from included if available, otherwise just the identifier.
 */
export declare function getRelated<T extends JsonApiResource>(response: {
    included?: JsonApiResource[];
}, relationship: Relationship | undefined): T | ResourceIdentifier | null;
/**
 * Gets all related resources from a to-many relationship.
 */
export declare function getRelatedMany<T extends JsonApiResource>(response: {
    included?: JsonApiResource[];
}, relationship: RelationshipMany | undefined): (T | ResourceIdentifier)[];
/**
 * Checks if a value is a full resource (not just an identifier).
 */
export declare function isFullResource<T extends JsonApiResource>(value: T | ResourceIdentifier): value is T;
/**
 * Checks if a response has included resources.
 */
export declare function hasIncluded(response: {
    included?: unknown[];
}): response is {
    included: JsonApiResource[];
};
export interface DenormalizedResource<TAttributes = Record<string, unknown>, TRelationships = Record<string, unknown>> {
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
export declare function denormalize<T extends JsonApiResource>(response: JsonApiResponse<T>): T & {
    _included: Map<string, JsonApiResource>;
};
/**
 * Creates a lookup map from included resources.
 */
export declare function createIncludedMap(included?: JsonApiResource[]): Map<string, JsonApiResource>;
/**
 * Looks up a resource from the included map.
 */
export declare function lookupIncluded<T extends JsonApiResource>(map: Map<string, JsonApiResource>, type: string, id: string): T | undefined;
//# sourceMappingURL=JsonApi.d.ts.map