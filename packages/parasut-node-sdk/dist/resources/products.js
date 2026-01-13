/**
 * Products Resource (Ürün)
 *
 * Manage products and services.
 */
import { BaseResource } from './BaseResource.js';
// ============================================================================
// Resource
// ============================================================================
export class ProductsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/products',
            resourceType: 'products',
        });
    }
    /**
     * Finds a product by code.
     */
    async findByCode(code) {
        return this.first({ filter: { code } });
    }
    /**
     * Finds a product by barcode.
     */
    async findByBarcode(barcode) {
        return this.first({ filter: { barcode } });
    }
}
//# sourceMappingURL=products.js.map