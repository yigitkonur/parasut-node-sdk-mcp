/**
 * E-Invoices Resource (E-Fatura)
 *
 * Manage e-invoice documents with PDF generation.
 */

import { BaseResource, type ResourceConfig } from './BaseResource.js';
import { TrackableJobsResource, type PollOptions } from './trackableJobs.js';
import type { JsonApiResource, JsonApiResponse } from '../generated/types.js';

// ============================================================================
// Types
// ============================================================================

export type EInvoiceScenario = 'basic' | 'commercial' | 'export';
export type EInvoiceStatus = 'waiting' | 'pending' | 'approved' | 'refused';

export interface EInvoiceAttributes {
  readonly uuid?: string;
  readonly vkn?: string;
  readonly invoice_number?: string;
  readonly status?: EInvoiceStatus;
  readonly printable_url?: string;
  readonly is_print_only?: boolean;
  readonly created_at?: string;
  readonly updated_at?: string;
  scenario?: EInvoiceScenario;
  to?: string;
  note?: string;
  vat_withholding_code?: string;
  vat_exemption_reason_code?: string;
  vat_exemption_reason?: string;
}

export interface EInvoice extends JsonApiResource<EInvoiceAttributes> {
  type: 'e_invoices';
}

export interface EInvoiceFilters {
  invoice_number?: string;
  status?: EInvoiceStatus;
  scenario?: EInvoiceScenario;
}

export interface PdfResult {
  url: string;
  expiresAt: Date;
}

// ============================================================================
// Resource
// ============================================================================

export class EInvoicesResource extends BaseResource<
  EInvoice,
  EInvoiceAttributes,
  EInvoiceFilters
> {
  private readonly trackableJobs: TrackableJobsResource;

  constructor(
    config: Omit<ResourceConfig, 'basePath' | 'resourceType'>,
    trackableJobs: TrackableJobsResource
  ) {
    super({
      ...config,
      basePath: '/e_invoices',
      resourceType: 'e_invoices',
    });
    this.trackableJobs = trackableJobs;
  }

  /**
   * Submits an e-invoice document for creation.
   * Returns a trackable job ID that must be polled for completion.
   */
  async submit(
    payload: {
      data: {
        type: 'e_invoices';
        attributes?: EInvoiceAttributes;
        relationships?: {
          sales_invoice?: { data: { id: string; type: 'sales_invoices' } };
          invoice?: { data: { id: string; type: 'e_invoice_inboxes' } };
        };
      };
    }
  ): Promise<{ data: { id: string; type: 'trackable_jobs' }; trackableJobId: string }> {
    const response = await this.transport.post<{
      data: { id: string; type: 'trackable_jobs' };
    }>(this.buildPath(), payload);

    return {
      data: response.data,
      trackableJobId: response.data.id,
    };
  }

  /**
   * Submits an e-invoice and waits for completion.
   */
  async submitAndWait(
    payload: {
      data: {
        type: 'e_invoices';
        attributes?: EInvoiceAttributes;
        relationships?: {
          sales_invoice?: { data: { id: string; type: 'sales_invoices' } };
          invoice?: { data: { id: string; type: 'e_invoice_inboxes' } };
        };
      };
    },
    options?: PollOptions
  ): Promise<JsonApiResponse<EInvoice>> {
    const createResult = await this.submit(payload);
    await this.trackableJobs.poll(createResult.trackableJobId, options);

    const response = await this.list({ page: { number: 1, size: 1 } });
    if (response.data.length === 0) {
      throw new Error('E-invoice created but could not be retrieved');
    }
    return { data: response.data[0]! };
  }

  /**
   * Gets the PDF URL for an e-invoice.
   */
  async pdf(
    id: string | number,
    options: { pollInterval?: number; timeout?: number } = {}
  ): Promise<PdfResult> {
    const { pollInterval = 2000, timeout = 60000 } = options;
    const startTime = Date.now();

    while (true) {
      if (Date.now() - startTime > timeout) {
        throw new Error(`PDF not ready after ${timeout}ms`);
      }

      const response = await this.transport.get<{
        status?: number;
        noContent?: boolean;
        data?: { attributes?: { url?: string } };
      }>(this.buildPath(id, '/pdf'));

      if (response.noContent || response.status === 204) {
        await this.sleep(pollInterval);
        continue;
      }

      const url = response.data?.attributes?.url;
      if (url) {
        return {
          url,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
      }

      await this.sleep(pollInterval);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
