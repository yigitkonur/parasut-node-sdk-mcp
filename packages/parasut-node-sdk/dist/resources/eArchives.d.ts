/**
 * E-Archives Resource (E-Arşiv)
 *
 * Manage e-archive documents with PDF generation.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import { TrackableJobsResource, type PollOptions } from './trackableJobs.js';
import type { JsonApiResource, JsonApiResponse } from '../generated/types.js';
export interface EArchiveAttributes {
    readonly uuid?: string;
    readonly vkn?: string;
    readonly invoice_number?: string;
    readonly status?: 'waiting' | 'pending' | 'approved' | 'refused';
    readonly printable_url?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    vat_withholding_code?: string;
    vat_exemption_reason_code?: string;
    vat_exemption_reason?: string;
    note?: string;
    is_for_abroad?: boolean;
    is_internet_sale?: boolean;
    internet_sale?: {
        url?: string;
        payment_type?: string;
        payment_platform?: string;
        payment_date?: string;
        send_date?: string;
    };
}
export interface EArchive extends JsonApiResource<EArchiveAttributes> {
    type: 'e_archives';
}
export interface EArchiveFilters {
    invoice_number?: string;
    status?: 'waiting' | 'pending' | 'approved' | 'refused';
}
export interface PdfResult {
    /**
     * Temporary URL to the PDF (valid for 1 hour).
     * Do not share directly with customers.
     */
    url: string;
    /**
     * When the URL expires.
     */
    expiresAt: Date;
}
export declare class EArchivesResource extends BaseResource<EArchive, EArchiveAttributes, EArchiveFilters> {
    private readonly trackableJobs;
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>, trackableJobs: TrackableJobsResource);
    /**
     * Creates an e-archive document.
     * Returns a trackable job ID that must be polled for completion.
     *
     * @example
     * ```typescript
     * const result = await client.eArchives.create({
     *   data: {
     *     type: 'e_archives',
     *     relationships: {
     *       sales_invoice: { data: { id: '123', type: 'sales_invoices' } }
     *     }
     *   }
     * });
     *
     * // Poll for completion
     * const job = await client.trackableJobs.poll(result.trackableJobId);
     * ```
     */
    submit(payload: {
        data: {
            type: 'e_archives';
            attributes?: EArchiveAttributes;
            relationships?: {
                sales_invoice?: {
                    data: {
                        id: string;
                        type: 'sales_invoices';
                    };
                };
            };
        };
    }): Promise<{
        data: {
            id: string;
            type: 'trackable_jobs';
        };
        trackableJobId: string;
    }>;
    /**
     * Creates an e-archive and waits for completion.
     */
    submitAndWait(payload: {
        data: {
            type: 'e_archives';
            attributes?: EArchiveAttributes;
            relationships?: {
                sales_invoice?: {
                    data: {
                        id: string;
                        type: 'sales_invoices';
                    };
                };
            };
        };
    }, options?: PollOptions): Promise<JsonApiResponse<EArchive>>;
    /**
     * Gets the PDF URL for an e-archive.
     * The PDF may not be immediately available after creation.
     * Returns 204 No Content if not ready yet.
     *
     * @example
     * ```typescript
     * const { url } = await client.eArchives.pdf(eArchiveId);
     * // Download the PDF from url before it expires
     * ```
     */
    pdf(id: string | number, options?: {
        pollInterval?: number;
        timeout?: number;
    }): Promise<PdfResult>;
    private sleep;
}
//# sourceMappingURL=eArchives.d.ts.map