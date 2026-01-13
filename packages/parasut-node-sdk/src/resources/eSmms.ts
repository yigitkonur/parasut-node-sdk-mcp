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

export class ESmmsResource extends BaseResource<ESmm, ESmmAttributes, ESmmFilters> {
  private readonly trackableJobs: TrackableJobsResource;

  constructor(
    config: Omit<ResourceConfig, 'basePath' | 'resourceType'>,
    trackableJobs: TrackableJobsResource
  ) {
    super({
      ...config,
      basePath: '/e_smms',
      resourceType: 'e_smms',
    });
    this.trackableJobs = trackableJobs;
  }

  async submit(
    payload: {
      data: {
        type: 'e_smms';
        attributes?: ESmmAttributes;
        relationships?: {
          sales_invoice?: { data: { id: string; type: 'sales_invoices' } };
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

  async submitAndWait(
    payload: {
      data: {
        type: 'e_smms';
        attributes?: ESmmAttributes;
        relationships?: {
          sales_invoice?: { data: { id: string; type: 'sales_invoices' } };
        };
      };
    },
    options?: PollOptions
  ): Promise<JsonApiResponse<ESmm>> {
    const createResult = await this.submit(payload);
    await this.trackableJobs.poll(createResult.trackableJobId, options);

    const response = await this.list({ page: { number: 1, size: 1 } });
    if (response.data.length === 0) {
      throw new Error('E-SMM created but could not be retrieved');
    }
    return { data: response.data[0]! };
  }

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
