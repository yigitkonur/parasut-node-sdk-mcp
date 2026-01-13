/**
 * Tags Resource (Etiket)
 *
 * Manage tags for organizing resources.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';

export interface TagAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  name: string;
}

export interface Tag extends JsonApiResource<TagAttributes> {
  type: 'tags';
}

export interface TagFilters {
  name?: string;
}

export class TagsResource extends BaseResource<Tag, TagAttributes, TagFilters> {
  constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>) {
    super({
      ...config,
      basePath: '/tags',
      resourceType: 'tags',
    });
  }
}
