/**
 * Products Resource (Ürün)
 *
 * Manage products and services.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';

// ============================================================================
// Types
// ============================================================================

export interface ProductAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly sales_excise_duty?: number;
  readonly sales_excise_duty_code?: string;
  readonly purchase_excise_duty?: number;
  readonly purchase_excise_duty_code?: string;
  readonly unit?: string;
  readonly communications_tax_rate?: number;
  readonly archived?: boolean;
  readonly inventory_tracking?: boolean;
  readonly initial_stock_count?: number;
  code?: string;
  name: string;
  vat_rate?: number;
  sales_excise_duty_type?: string;
  purchase_excise_duty_type?: string;
  barcode?: string;
  list_price?: number;
  currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  buying_price?: number;
  buying_currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
}

export interface Product extends JsonApiResource<ProductAttributes> {
  type: 'products';
}

export interface ProductFilters {
  name?: string;
  code?: string;
  barcode?: string;
}

// ============================================================================
// Resource
// ============================================================================

export class ProductsResource extends BaseResource<
  Product,
  ProductAttributes,
  ProductFilters
> {
  constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>) {
    super({
      ...config,
      basePath: '/products',
      resourceType: 'products',
    });
  }

  /**
   * Finds a product by code.
   */
  async findByCode(code: string) {
    return this.first({ filter: { code } });
  }

  /**
   * Finds a product by barcode.
   */
  async findByBarcode(barcode: string) {
    return this.first({ filter: { barcode } });
  }
}
