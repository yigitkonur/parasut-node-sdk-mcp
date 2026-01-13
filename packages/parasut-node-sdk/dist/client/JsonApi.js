/**
 * JSON:API Helpers
 *
 * Utilities for building and parsing JSON:API formatted payloads.
 * Follows the JSON:API specification: https://jsonapi.org/
 */
// ============================================================================
// Resource Building
// ============================================================================
/**
 * Builds a JSON:API resource object for creation.
 * The id should be empty or omitted for new resources.
 */
export function buildResource(type, attributes, relationships) {
    const data = {
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
export function buildUpdateResource(id, type, attributes, relationships) {
    const data = {
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
function formatRelationships(input) {
    const result = {};
    for (const [key, value] of Object.entries(input)) {
        if (value === null) {
            result[key] = { data: null };
        }
        else if (Array.isArray(value)) {
            result[key] = {
                data: value.map((v) => ({ id: v.id, type: v.type })),
            };
        }
        else {
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
export function rel(type, id) {
    return { type, id: String(id) };
}
/**
 * Creates multiple relationship references.
 */
export function relMany(type, ids) {
    return ids.map((id) => ({ type, id: String(id) }));
}
/**
 * Creates a null relationship (for clearing).
 */
export function relNull() {
    return null;
}
// ============================================================================
// Response Parsing
// ============================================================================
/**
 * Extracts the data from a JSON:API response.
 */
export function extractData(response) {
    return response.data;
}
/**
 * Extracts the data array from a list response.
 */
export function extractListData(response) {
    return response.data;
}
/**
 * Finds an included resource by type and id.
 */
export function findIncluded(response, type, id) {
    return response.included?.find((r) => r.type === type && r.id === id);
}
/**
 * Finds all included resources of a specific type.
 */
export function findAllIncluded(response, type) {
    return (response.included?.filter((r) => r.type === type) ?? []);
}
/**
 * Gets the related resource from a relationship.
 * Returns the resource from included if available, otherwise just the identifier.
 */
export function getRelated(response, relationship) {
    if (!relationship?.data) {
        return null;
    }
    const { id, type } = relationship.data;
    const included = findIncluded(response, type, id);
    return included ?? { id, type };
}
/**
 * Gets all related resources from a to-many relationship.
 */
export function getRelatedMany(response, relationship) {
    if (!relationship?.data || !Array.isArray(relationship.data)) {
        return [];
    }
    return relationship.data.map(({ id, type }) => {
        const included = findIncluded(response, type, id);
        return included ?? { id, type };
    });
}
// ============================================================================
// Type Guards
// ============================================================================
/**
 * Checks if a value is a full resource (not just an identifier).
 */
export function isFullResource(value) {
    return 'attributes' in value;
}
/**
 * Checks if a response has included resources.
 */
export function hasIncluded(response) {
    return Array.isArray(response.included) && response.included.length > 0;
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
export function denormalize(response) {
    const includedMap = new Map();
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
export function createIncludedMap(included) {
    const map = new Map();
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
export function lookupIncluded(map, type, id) {
    return map.get(`${type}:${id}`);
}
//# sourceMappingURL=JsonApi.js.map