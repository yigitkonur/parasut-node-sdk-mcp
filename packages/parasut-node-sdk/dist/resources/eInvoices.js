/**
 * E-Invoices Resource (E-Fatura)
 *
 * Manage e-invoice documents with PDF generation.
 */
import { BaseResource } from './BaseResource.js';
// ============================================================================
// Resource
// ============================================================================
export class EInvoicesResource extends BaseResource {
    trackableJobs;
    constructor(config, trackableJobs) {
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
    async submit(payload) {
        const response = await this.transport.post(this.buildPath(), payload);
        return {
            data: response.data,
            trackableJobId: response.data.id,
        };
    }
    /**
     * Submits an e-invoice and waits for completion.
     */
    async submitAndWait(payload, options) {
        const createResult = await this.submit(payload);
        await this.trackableJobs.poll(createResult.trackableJobId, options);
        const response = await this.list({ page: { number: 1, size: 1 } });
        if (response.data.length === 0) {
            throw new Error('E-invoice created but could not be retrieved');
        }
        return { data: response.data[0] };
    }
    /**
     * Gets the PDF URL for an e-invoice.
     */
    async pdf(id, options = {}) {
        const { pollInterval = 2000, timeout = 60000 } = options;
        const startTime = Date.now();
        while (true) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`PDF not ready after ${timeout}ms`);
            }
            const response = await this.transport.get(this.buildPath(id, '/pdf'));
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
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=eInvoices.js.map