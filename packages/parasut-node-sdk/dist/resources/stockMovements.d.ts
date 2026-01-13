/**
 * Stock Movements Resource (Stok Hareketi)
 *
 * View stock movement history.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';
export interface StockMovementAttributes {
    readonly date?: string;
    readonly quantity?: number;
    readonly unit_price?: number;
    readonly currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
    readonly created_at?: string;
    readonly updated_at?: string;
}
export interface StockMovement extends JsonApiResource<StockMovementAttributes> {
    type: 'stock_movements';
}
export interface StockMovementFilters {
    product_id?: number;
    warehouse_id?: number;
    date?: string;
}
export declare class StockMovementsResource extends BaseResource<StockMovement, StockMovementAttributes, StockMovementFilters> {
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>);
}
//# sourceMappingURL=stockMovements.d.ts.map