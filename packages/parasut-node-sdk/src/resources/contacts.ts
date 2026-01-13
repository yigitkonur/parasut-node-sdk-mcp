/**
 * Contacts Resource (Müşteri / Tedarikçi)
 *
 * Manage customers and suppliers.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';

// ============================================================================
// Types
// ============================================================================

export interface ContactAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly contact_type?: 'person' | 'company';
  readonly balance?: number;
  readonly trl_balance?: number;
  readonly usd_balance?: number;
  readonly eur_balance?: number;
  readonly gbp_balance?: number;
  readonly short_name?: string;
  name: string;
  email?: string;
  account_type: 'customer' | 'supplier';
  tax_office?: string;
  tax_number?: string;
  district?: string;
  city?: string;
  address?: string;
  phone?: string;
  fax?: string;
  is_abroad?: boolean;
  archived?: boolean;
  iban?: string;
}

export interface Contact extends JsonApiResource<ContactAttributes> {
  type: 'contacts';
}

export interface ContactFilters {
  name?: string;
  email?: string;
  tax_number?: string;
  tax_office?: string;
  city?: string;
  account_type?: 'customer' | 'supplier';
}

// ============================================================================
// Resource
// ============================================================================

export class ContactsResource extends BaseResource<
  Contact,
  ContactAttributes,
  ContactFilters
> {
  constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>) {
    super({
      ...config,
      basePath: '/contacts',
      resourceType: 'contacts',
    });
  }

  /**
   * Finds contacts by name (partial match).
   */
  async findByName(name: string) {
    return this.list({ filter: { name } });
  }

  /**
   * Finds a contact by tax number.
   */
  async findByTaxNumber(taxNumber: string) {
    return this.first({ filter: { tax_number: taxNumber } });
  }

  /**
   * Lists all customers.
   */
  async listCustomers() {
    return this.list({ filter: { account_type: 'customer' } });
  }

  /**
   * Lists all suppliers.
   */
  async listSuppliers() {
    return this.list({ filter: { account_type: 'supplier' } });
  }
}
