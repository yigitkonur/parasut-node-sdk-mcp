/**
 * Tags Resource (Etiket)
 *
 * Manage tags for organizing resources.
 */
import { BaseResource } from './BaseResource.js';
export class TagsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/tags',
            resourceType: 'tags',
        });
    }
}
//# sourceMappingURL=tags.js.map