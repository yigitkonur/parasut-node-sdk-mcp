/**
 * Item Categories Resource (Kategori)
 *
 * Manage categories for products and expenses.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';
export type CategoryType = 'Product' | 'Contact' | 'SalesInvoice' | 'Employee' | 'BankFee' | 'PurchaseBill' | 'Tax' | 'Salary';
export interface ItemCategoryAttributes {
    readonly created_at?: string;
    readonly updated_at?: string;
    name: string;
    category_type?: CategoryType;
    bg_color?: string;
    text_color?: string;
}
export interface ItemCategory extends JsonApiResource<ItemCategoryAttributes> {
    type: 'item_categories';
}
export interface ItemCategoryFilters {
    name?: string;
    category_type?: CategoryType;
}
export declare class ItemCategoriesResource extends BaseResource<ItemCategory, ItemCategoryAttributes, ItemCategoryFilters> {
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>);
    /**
     * Lists categories of a specific type.
     */
    listByType(type: CategoryType): Promise<import("./BaseResource.js").PaginatedResponse<ItemCategory>>;
}
//# sourceMappingURL=itemCategories.d.ts.map