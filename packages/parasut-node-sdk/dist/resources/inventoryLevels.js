/**
 * Inventory Levels Resource (Depo Stok Seviyesi)
 *
 * View inventory levels per warehouse.
 */
import { BaseResource } from './BaseResource.js';
export class InventoryLevelsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/inventory_levels',
            resourceType: 'inventory_levels',
        });
    }
    async getForProduct(productId) {
        return this.list({ filter: { product_id: productId } });
    }
    async getForWarehouse(warehouseId) {
        return this.list({ filter: { warehouse_id: warehouseId } });
    }
}
//# sourceMappingURL=inventoryLevels.js.map