/**
 * E-SMMs Resource (E-Serbest Meslek Makbuzu)
 *
 * Manage e-receipts for freelancers.
 */
import { BaseResource, type ResourceConfig } from './BaseResource.js';
import { TrackableJobsResource, type PollOptions } from './trackableJobs.js';
import type { JsonApiResource, JsonApiResponse } from '../generated/types.js';
export interface ESmmAttributes {
    readonly uuid?: string;
    readonly vkn?: string;
    readonly receipt_number?: string;
    readonly status?: 'waiting' | 'pending' | 'approved' | 'refused';
    readonly printable_url?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    note?: string;
}
export interface ESmm extends JsonApiResource<ESmmAttributes> {
    type: 'e_smms';
}
export interface ESmmFilters {
    receipt_number?: string;
    status?: 'waiting' | 'pending' | 'approved' | 'refused';
}
export interface PdfResult {
    url: string;
    expiresAt: Date;
}
export declare class ESmmsResource extends BaseResource<ESmm, ESmmAttributes, ESmmFilters> {
    private readonly trackableJobs;
    constructor(config: Omit<ResourceConfig, 'basePath' | 'resourceType'>, trackableJobs: TrackableJobsResource);
    submit(payload: {
        data: {
            type: 'e_smms';
            attributes?: ESmmAttributes;
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
    submitAndWait(payload: {
        data: {
            type: 'e_smms';
            attributes?: ESmmAttributes;
            relationships?: {
                sales_invoice?: {
                    data: {
                        id: string;
                        type: 'sales_invoices';
                    };
                };
            };
        };
    }, options?: PollOptions): Promise<JsonApiResponse<ESmm>>;
    pdf(id: string | number, options?: {
        pollInterval?: number;
        timeout?: number;
    }): Promise<PdfResult>;
    private sleep;
}
//# sourceMappingURL=eSmms.d.ts.map