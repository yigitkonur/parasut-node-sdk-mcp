/**
 * Contacts Resource (Müşteri / Tedarikçi)
 *
 * Manage customers and suppliers.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource } from '../generated/types.js';
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
export declare class ContactsResource extends BaseResource<Contact, ContactAttributes, ContactFilters> {
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>);
    /**
     * Finds contacts by name (partial match).
     */
    findByName(name: string): Promise<import("./BaseResource.js").PaginatedResponse<Contact>>;
    /**
     * Finds a contact by tax number.
     */
    findByTaxNumber(taxNumber: string): Promise<Contact | null>;
    /**
     * Lists all customers.
     */
    listCustomers(): Promise<import("./BaseResource.js").PaginatedResponse<Contact>>;
    /**
     * Lists all suppliers.
     */
    listSuppliers(): Promise<import("./BaseResource.js").PaginatedResponse<Contact>>;
}
//# sourceMappingURL=contacts.d.ts.map