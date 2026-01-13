/**
 * Inventory Levels Resource (Depo Stok Seviyesi)
 *
 * View inventory levels per warehouse.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';

export interface InventoryLevelAttributes {
  readonly stock_count?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface InventoryLevel extends JsonApiResource<InventoryLevelAttributes> {
  type: 'inventory_levels';
}

export interface InventoryLevelFilters {
  product_id?: number;
  warehouse_id?: number;
}

export class InventoryLevelsResource extends BaseResource<
  InventoryLevel,
  InventoryLevelAttributes,
  InventoryLevelFilters
> {
  constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>) {
    super({
      ...config,
      basePath: '/inventory_levels',
      resourceType: 'inventory_levels',
    });
  }

  async getForProduct(productId: number) {
    return this.list({ filter: { product_id: productId } });
  }

  async getForWarehouse(warehouseId: number) {
    return this.list({ filter: { warehouse_id: warehouseId } });
  }
}
