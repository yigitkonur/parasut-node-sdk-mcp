/**
 * Stock Movements Resource (Stok Hareketi)
 *
 * View stock movement history.
 */
import { BaseResource } from './BaseResource.js';
export class StockMovementsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/stock_movements',
            resourceType: 'stock_movements',
        });
    }
}
//# sourceMappingURL=stockMovements.js.map