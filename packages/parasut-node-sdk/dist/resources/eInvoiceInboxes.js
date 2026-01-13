/**
 * E-Invoice Inboxes Resource (E-Fatura Gelen Kutusu)
 *
 * Check if a contact is an e-invoice user.
 */
import { BaseResource } from './BaseResource.js';
// ============================================================================
// Resource
// ============================================================================
export class EInvoiceInboxesResource extends BaseResource {
    constructor(config) {
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
    async checkByVkn(vkn) {
        const response = await this.list({ filter: { vkn } });
        return response.data[0] ?? null;
    }
    /**
     * Determines whether to use e-invoice or e-archive for a contact.
     */
    async shouldUseEInvoice(vkn) {
        const inbox = await this.checkByVkn(vkn);
        return inbox !== null;
    }
}
//# sourceMappingURL=eInvoiceInboxes.js.map