/**
 * Contacts Resource (Müşteri / Tedarikçi)
 *
 * Manage customers and suppliers.
 */
import { BaseResource } from './BaseResource.js';
// ============================================================================
// Resource
// ============================================================================
export class ContactsResource extends BaseResource {
    constructor(config) {
        super({
            ...config,
            basePath: '/contacts',
            resourceType: 'contacts',
        });
    }
    /**
     * Finds contacts by name (partial match).
     */
    async findByName(name) {
        return this.list({ filter: { name } });
    }
    /**
     * Finds a contact by tax number.
     */
    async findByTaxNumber(taxNumber) {
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
//# sourceMappingURL=contacts.js.map