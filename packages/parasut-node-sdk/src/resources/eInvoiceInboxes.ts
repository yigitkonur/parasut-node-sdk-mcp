/**
 * E-Invoice Inboxes Resource (E-Fatura Gelen Kutusu)
 *
 * Check if a contact is an e-invoice user.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';

// ============================================================================
// Types
// ============================================================================

export interface EInvoiceInboxAttributes {
  readonly vkn?: string;
  readonly e_invoice_address?: string;
  readonly name?: string;
  readonly inbox_type?: 'B2B' | 'B2C';
  readonly address_registered_at?: string;
  readonly registered_at?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface EInvoiceInbox extends JsonApiResource<EInvoiceInboxAttributes> {
  type: 'e_invoice_inboxes';
}

export interface EInvoiceInboxFilters {
  vkn?: string;
}

// ============================================================================
// Resource
// ============================================================================

export class EInvoiceInboxesResource extends BaseResource<
  EInvoiceInbox,
  EInvoiceInboxAttributes,
  EInvoiceInboxFilters
> {
  constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>) {
    super({
      ...config,
      basePath: '/e_invoice_inboxes',
      resourceType: 'e_invoice_inboxes',
    });
  }

  /**
   * Checks if a contact with the given VKN (tax number) is an e-invoice user.
   * Returns the inbox if they are, null otherwise.
   *
   * @example
   * ```typescript
   * const inbox = await client.eInvoiceInboxes.checkByVkn('1234567890');
   * if (inbox) {
   *   console.log('Contact is e-invoice user');
   *   // Create e-invoice
   * } else {
   *   console.log('Contact is not e-invoice user');
   *   // Create e-archive instead
   * }
   * ```
   */
  async checkByVkn(vkn: string): Promise<EInvoiceInbox | null> {
    const response = await this.list({ filter: { vkn } });
    return response.data[0] ?? null;
  }

  /**
   * Determines whether to use e-invoice or e-archive for a contact.
   */
  async shouldUseEInvoice(vkn: string): Promise<boolean> {
    const inbox = await this.checkByVkn(vkn);
    return inbox !== null;
  }
}
