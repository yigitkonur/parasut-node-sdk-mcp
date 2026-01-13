/**
 * Sales Offers Resource (Teklif)
 *
 * Manage sales offers/quotes with conversion to invoice.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import type { JsonApiResource, JsonApiResponse } from '../generated/types.js';
export type Currency = 'TRL' | 'USD' | 'EUR' | 'GBP';
export interface SalesOfferAttributes {
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly gross_total?: number;
    readonly net_total?: number;
    readonly total_discount?: number;
    readonly total_vat?: number;
    archived?: boolean;
    offer_no?: string;
    description?: string;
    issue_date: string;
    valid_until_date?: string;
    currency?: Currency;
    exchange_rate?: number;
    billing_address?: string;
    billing_phone?: string;
    billing_fax?: string;
    tax_office?: string;
    tax_number?: string;
    city?: string;
    district?: string;
    note?: string;
}
export interface SalesOffer extends JsonApiResource<SalesOfferAttributes> {
    type: 'sales_offers';
}
export interface SalesOfferFilters {
    issue_date?: string;
    contact_id?: number;
    offer_no?: string;
}
export interface PdfResult {
    url: string;
    expiresAt: Date;
}
export declare class SalesOffersResource extends BaseResource<SalesOffer, SalesOfferAttributes, SalesOfferFilters> {
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>);
    /**
     * Archives a sales offer.
     */
    archive(id: string | number): Promise<JsonApiResponse<SalesOffer>>;
    /**
     * Unarchives a sales offer.
     */
    unarchive(id: string | number): Promise<JsonApiResponse<SalesOffer>>;
    /**
     * Gets the PDF URL for a sales offer.
     */
    pdf(id: string | number, options?: {
        pollInterval?: number;
        timeout?: number;
    }): Promise<PdfResult>;
    /**
     * Converts a sales offer to a sales invoice.
     * Returns the newly created invoice.
     */
    convertToInvoice(id: string | number, invoiceData?: Partial<{
        issue_date: string;
        due_date: string;
        description: string;
    }>): Promise<JsonApiResponse<JsonApiResource>>;
    private sleep;
}
//# sourceMappingURL=salesOffers.d.ts.map