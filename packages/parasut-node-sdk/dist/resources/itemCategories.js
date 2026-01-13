/**
 * Item Categories Resource (Kategori)
 *
 * Manage categories for products and expenses.
 */
import { BaseResource } from './BaseResource.js';
export class ItemCategoriesResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/item_categories',
            resourceType: 'item_categories',
        });
    }
    /**
     * Lists categories of a specific type.
     */
    async listByType(type) {
        return this.list({ filter: { category_type: type } });
    }
}
//# sourceMappingURL=itemCategories.js.map