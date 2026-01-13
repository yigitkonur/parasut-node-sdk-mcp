/**
 * E-SMMs Resource (E-Serbest Meslek Makbuzu)
 *
 * Manage e-receipts for freelancers.
 */
import { BaseResource } from './BaseResource.js';
export class ESmmsResource extends BaseResource {
    trackableJobs;
    constructor(config, trackableJobs) {
        super({
            ...config,
            basePath: '/e_smms',
            resourceType: 'e_smms',
        });
        this.trackableJobs = trackableJobs;
    }
    async submit(payload) {
        const response = await this.transport.post(this.buildPath(), payload);
        return {
            data: response.data,
            trackableJobId: response.data.id,
        };
    }
    async submitAndWait(payload, options) {
        const createResult = await this.submit(payload);
        await this.trackableJobs.poll(createResult.trackableJobId, options);
        const response = await this.list({ page: { number: 1, size: 1 } });
        if (response.data.length === 0) {
            throw new Error('E-SMM created but could not be retrieved');
        }
        return { data: response.data[0] };
    }
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
//# sourceMappingURL=eSmms.js.map