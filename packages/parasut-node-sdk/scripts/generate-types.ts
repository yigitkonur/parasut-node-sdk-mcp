#!/usr/bin/env tsx
/**
 * Type Generation Script
 *
 * Parses the Paraşüt swagger.yaml and generates TypeScript types.
 * Run with: npm run generate
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const SWAGGER_PATH = resolve(__dirname, '../../../spec/swagger.yaml');
const OUTPUT_DIR = resolve(__dirname, '../src/generated');
const TYPES_OUTPUT = resolve(OUTPUT_DIR, 'types.ts');
const OPERATIONS_OUTPUT = resolve(OUTPUT_DIR, 'operations.ts');

// Type mapping from Swagger to TypeScript
const TYPE_MAP: Record<string, string> = {
  string: 'string',
  integer: 'number',
  number: 'number',
  boolean: 'boolean',
  object: 'Record<string, unknown>',
  array: 'unknown[]',
};

interface SwaggerSpec {
  paths: Record<string, PathItem>;
  definitions: Record<string, SchemaObject>;
}

interface PathItem {
  parameters?: ParameterObject[];
  get?: OperationObject;
  post?: OperationObject;
  put?: OperationObject;
  patch?: OperationObject;
  delete?: OperationObject;
}

interface OperationObject {
  operationId: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  responses?: Record<string, ResponseObject>;
}

interface ParameterObject {
  name: string;
  in: 'query' | 'path' | 'body' | 'header';
  type?: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  schema?: SchemaObject;
  enum?: string[];
}

interface ResponseObject {
  description?: string;
  schema?: SchemaObject;
}

interface SchemaObject {
  type?: string;
  format?: string;
  description?: string;
  readOnly?: boolean;
  enum?: string[];
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  $ref?: string;
  maxLength?: number;
}

interface OperationInfo {
  operationId: string;
  method: string;
  path: string;
  tag: string;
  summary: string;
  hasCompanyId: boolean;
  pathParams: string[];
  queryParams: QueryParam[];
  bodyParam?: string;
  responseType: string | null;
  successStatus: number;
}

interface QueryParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: unknown;
}

// Helpers
function pascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

function camelCase(str: string): string {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Check if a string is a valid JS identifier (can be used without quotes)
 */
function isValidIdentifier(str: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
}

/**
 * Format a property key - quote if it contains special characters
 */
function formatPropertyKey(key: string): string {
  if (isValidIdentifier(key)) {
    return key;
  }
  return `'${key}'`;
}

function resolveRef(ref: string): string {
  // #/definitions/Account -> Account
  return ref.replace('#/definitions/', '');
}

function swaggerTypeToTs(schema: SchemaObject, definitions: Record<string, SchemaObject>): string {
  if (schema.$ref) {
    return resolveRef(schema.$ref);
  }

  if (schema.enum) {
    return schema.enum.map((v) => `'${v}'`).join(' | ');
  }

  if (schema.type === 'array') {
    if (schema.items) {
      const itemType = swaggerTypeToTs(schema.items, definitions);
      return `${itemType}[]`;
    }
    return 'unknown[]';
  }

  if (schema.type === 'object' && schema.properties) {
    const props = Object.entries(schema.properties)
      .map(([key, prop]) => {
        const optional = !schema.required?.includes(key) ? '?' : '';
        const type = swaggerTypeToTs(prop, definitions);
        return `  ${key}${optional}: ${type};`;
      })
      .join('\n');
    return `{\n${props}\n}`;
  }

  return TYPE_MAP[schema.type ?? 'string'] ?? 'unknown';
}

function generateDefinitionType(
  name: string,
  schema: SchemaObject,
  definitions: Record<string, SchemaObject>
): string {
  const lines: string[] = [];

  if (schema.description) {
    lines.push(`/** ${schema.description} */`);
  }

  if (schema.type === 'object' && schema.properties) {
    lines.push(`export interface ${name} {`);

    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const required = schema.required?.includes(propName);
      const readonly = propSchema.readOnly ? 'readonly ' : '';
      let type = swaggerTypeToTs(propSchema, definitions);

      // Quote property names with special characters
      const key = formatPropertyKey(propName);
      const optional = isValidIdentifier(propName) ? (required ? '' : '?') : '';

      // Add description as JSDoc
      if (propSchema.description) {
        lines.push(`  /** ${propSchema.description} */`);
      }

      lines.push(`  ${readonly}${key}${optional}: ${type};`);
    }

    lines.push('}');
  } else {
    // Type alias for simple types
    const type = swaggerTypeToTs(schema, definitions);
    lines.push(`export type ${name} = ${type};`);
  }

  return lines.join('\n');
}

function extractOperations(spec: SwaggerSpec): OperationInfo[] {
  const operations: OperationInfo[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    const pathParams = path.match(/\{([^}]+)\}/g)?.map((p) => p.slice(1, -1)) ?? [];
    const hasCompanyId = pathParams.includes('company_id');

    for (const method of ['get', 'post', 'put', 'patch', 'delete'] as const) {
      const operation = pathItem[method];
      if (!operation || !operation.operationId) continue;

      // Merge path-level and operation-level parameters
      const allParams = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])];

      // Extract query parameters
      const queryParams: QueryParam[] = allParams
        .filter((p) => p.in === 'query')
        .map((p) => ({
          name: p.name,
          type: p.enum ? p.enum.map((v) => `'${v}'`).join(' | ') : TYPE_MAP[p.type ?? 'string'] ?? 'string',
          required: p.required ?? false,
          description: p.description,
          default: p.default,
        }));

      // Extract body parameter type
      const bodyParam = allParams.find((p) => p.in === 'body');
      let bodyType: string | undefined;
      if (bodyParam?.schema) {
        if (bodyParam.schema.$ref) {
          bodyType = resolveRef(bodyParam.schema.$ref);
        } else if (bodyParam.name) {
          bodyType = pascalCase(bodyParam.name) + 'Input';
        }
      }

      // Find success response type
      let responseType: string | null = null;
      let successStatus = 200;
      const responses = operation.responses ?? {};

      for (const [status, response] of Object.entries(responses)) {
        const statusNum = parseInt(status, 10);
        if (statusNum >= 200 && statusNum < 300 && response.schema) {
          successStatus = statusNum;
          if (response.schema.$ref) {
            responseType = resolveRef(response.schema.$ref);
          } else if (response.schema.properties?.data) {
            const dataProp = response.schema.properties.data;
            if (dataProp.$ref) {
              responseType = resolveRef(dataProp.$ref);
            } else if (dataProp.type === 'array' && dataProp.items?.$ref) {
              responseType = resolveRef(dataProp.items.$ref) + '[]';
            }
          }
          break;
        }
      }

      operations.push({
        operationId: operation.operationId,
        method: method.toUpperCase(),
        path,
        tag: operation.tags?.[0] ?? 'Default',
        summary: operation.summary ?? '',
        hasCompanyId,
        pathParams: pathParams.filter((p) => p !== 'company_id'),
        queryParams,
        bodyParam: bodyType,
        responseType,
        successStatus,
      });
    }
  }

  return operations;
}

function generateTypesFile(definitions: Record<string, SchemaObject>): string {
  const lines: string[] = [
    '/**',
    ' * Auto-generated TypeScript types from Paraşüt Swagger spec.',
    ' * DO NOT EDIT MANUALLY - run `npm run generate` instead.',
    ' */',
    '',
    '// ============================================================================',
    '// Common Types',
    '// ============================================================================',
    '',
    '/** Pagination metadata for list responses */',
    'export interface ListMeta {',
    '  current_page: number;',
    '  total_pages: number;',
    '  total_count: number;',
    '}',
    '',
    '/** API error response */',
    'export interface ApiError {',
    '  title: string;',
    '  detail: string;',
    '}',
    '',
    '/** JSON:API relationship (single) */',
    'export interface Relationship {',
    '  data: {',
    '    id: string;',
    '    type: string;',
    '  } | null;',
    '}',
    '',
    '/** JSON:API relationship (multiple) */',
    'export interface RelationshipMany {',
    '  data: Array<{',
    '    id: string;',
    '    type: string;',
    '  }>;',
    '}',
    '',
    '/** Base JSON:API resource */',
    'export interface JsonApiResource<TAttributes = Record<string, unknown>, TRelationships = Record<string, unknown>> {',
    '  id: string;',
    '  type: string;',
    '  attributes: TAttributes;',
    '  relationships?: TRelationships;',
    '}',
    '',
    '/** JSON:API single resource response */',
    'export interface JsonApiResponse<T> {',
    '  data: T;',
    '  included?: JsonApiResource[];',
    '}',
    '',
    '/** JSON:API list response */',
    'export interface JsonApiListResponse<T> {',
    '  data: T[];',
    '  meta: ListMeta;',
    '  included?: JsonApiResource[];',
    '}',
    '',
    '// ============================================================================',
    '// Resource Types (Generated from definitions)',
    '// ============================================================================',
    '',
  ];

  // Sort definitions for consistent output
  const sortedNames = Object.keys(definitions).sort();

  for (const name of sortedNames) {
    const schema = definitions[name];
    if (!schema) continue;

    // Skip Error and ListMeta as we define them manually
    if (name === 'Error' || name === 'ListMeta') continue;

    const typeCode = generateDefinitionType(name, schema, definitions);
    lines.push(typeCode);
    lines.push('');
  }

  return lines.join('\n');
}

function generateOperationsFile(operations: OperationInfo[]): string {
  const lines: string[] = [
    '/**',
    ' * Auto-generated operation metadata from Paraşüt Swagger spec.',
    ' * DO NOT EDIT MANUALLY - run `npm run generate` instead.',
    ' */',
    '',
    'export interface OperationMeta {',
    '  operationId: string;',
    '  method: string;',
    '  path: string;',
    '  tag: string;',
    '  summary: string;',
    '  hasCompanyId: boolean;',
    '  pathParams: string[];',
    '  successStatus: number;',
    '}',
    '',
    'export const OPERATIONS: Record<string, OperationMeta> = {',
  ];

  for (const op of operations) {
    const key = formatPropertyKey(op.operationId);
    lines.push(`  ${key}: {`);
    lines.push(`    operationId: '${op.operationId}',`);
    lines.push(`    method: '${op.method}',`);
    lines.push(`    path: '${op.path}',`);
    lines.push(`    tag: '${op.tag}',`);
    lines.push(`    summary: '${op.summary.replace(/'/g, "\\'")}',`);
    lines.push(`    hasCompanyId: ${op.hasCompanyId},`);
    lines.push(`    pathParams: [${op.pathParams.map((p) => `'${p}'`).join(', ')}],`);
    lines.push(`    successStatus: ${op.successStatus},`);
    lines.push(`  },`);
  }

  lines.push('};');
  lines.push('');

  // Group operations by tag for easy resource mapping
  const byTag = new Map<string, OperationInfo[]>();
  for (const op of operations) {
    const tag = op.tag;
    if (!byTag.has(tag)) {
      byTag.set(tag, []);
    }
    byTag.get(tag)!.push(op);
  }

  lines.push('/** Operations grouped by resource tag */');
  lines.push('export const OPERATIONS_BY_TAG: Record<string, string[]> = {');
  for (const [tag, ops] of byTag) {
    const opIds = ops.map((o) => `'${o.operationId}'`).join(', ');
    lines.push(`  '${tag}': [${opIds}],`);
  }
  lines.push('};');
  lines.push('');

  // Generate filter types per resource
  lines.push('// ============================================================================');
  lines.push('// Filter Types per Resource');
  lines.push('// ============================================================================');
  lines.push('');

  for (const [tag, ops] of byTag) {
    const listOp = ops.find((o) => o.operationId.startsWith('list'));
    if (listOp && listOp.queryParams.length > 0) {
      const filterParams = listOp.queryParams.filter((p) => p.name.startsWith('filter['));
      if (filterParams.length > 0) {
        const resourceName = pascalCase(tag);
        lines.push(`export interface ${resourceName}Filters {`);
        for (const param of filterParams) {
          // Extract filter name: filter[name] -> name
          const filterName = param.name.replace('filter[', '').replace(']', '');
          const key = formatPropertyKey(filterName);
          const optional = isValidIdentifier(filterName) ? '?' : '';
          lines.push(`  /** ${param.description ?? ''} */`);
          lines.push(`  ${key}${optional}: ${param.type};`);
        }
        lines.push('}');
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

// Main execution
function main() {
  console.log('🔧 Generating types from swagger.yaml...\n');

  // Read and parse swagger
  console.log('📖 Reading swagger spec...');
  const swaggerContent = readFileSync(SWAGGER_PATH, 'utf-8');
  const spec = parseYaml(swaggerContent) as SwaggerSpec;

  console.log(`   Found ${Object.keys(spec.definitions).length} definitions`);
  console.log(`   Found ${Object.keys(spec.paths).length} paths`);

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate types
  console.log('\n📝 Generating types.ts...');
  const typesContent = generateTypesFile(spec.definitions);
  writeFileSync(TYPES_OUTPUT, typesContent, 'utf-8');
  console.log(`   Written to ${TYPES_OUTPUT}`);

  // Extract and generate operations
  console.log('\n📝 Generating operations.ts...');
  const operations = extractOperations(spec);
  console.log(`   Found ${operations.length} operations`);
  const operationsContent = generateOperationsFile(operations);
  writeFileSync(OPERATIONS_OUTPUT, operationsContent, 'utf-8');
  console.log(`   Written to ${OPERATIONS_OUTPUT}`);

  console.log('\n✅ Type generation complete!');
}

main();
