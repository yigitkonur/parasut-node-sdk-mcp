/**
 * Trackable Jobs Resource
 *
 * Handles async job tracking for e-Invoice, e-Archive, and e-Smm creation.
 */
export class TrackableJobError extends Error {
    jobId;
    errors;
    constructor(message, jobId, errors) {
        super(message);
        this.jobId = jobId;
        this.errors = errors;
        this.name = 'TrackableJobError';
    }
}
export class TrackableJobTimeoutError extends Error {
    jobId;
    lastStatus;
    constructor(jobId, lastStatus, timeoutMs) {
        super(`Job ${jobId} timed out after ${timeoutMs}ms (status: ${lastStatus})`);
        this.jobId = jobId;
        this.lastStatus = lastStatus;
        this.name = 'TrackableJobTimeoutError';
    }
}
// ============================================================================
// Resource
// ============================================================================
export class TrackableJobsResource {
    transport;
    companyId;
    constructor(transport, companyId) {
        this.transport = transport;
        this.companyId = companyId;
    }
    /**
     * Gets the current status of a trackable job.
     */
    async get(id) {
        return this.transport.get(`/${this.companyId}/trackable_jobs/${id}`);
    }
    /**
     * Polls a job until it reaches a terminal state (done or error).
     *
     * @example
     * ```typescript
     * const job = await client.trackableJobs.poll(jobId, {
     *   pollInterval: 2000,
     *   timeout: 60000
     * });
     * console.log('Job completed:', job.attributes.status);
     * ```
     */
    async poll(id, options = {}) {
        const { pollInterval = 2000, timeout = 60_000, } = options;
        const startTime = Date.now();
        let lastStatus = 'pending';
        while (true) {
            // Check timeout
            if (Date.now() - startTime > timeout) {
                throw new TrackableJobTimeoutError(id, lastStatus, timeout);
            }
            // Get job status
            const response = await this.get(id);
            const job = response.data;
            lastStatus = job.attributes.status;
            switch (lastStatus) {
                case 'done':
                    return job;
                case 'error':
                    throw new TrackableJobError(`Job ${id} failed: ${job.attributes.errors?.join(', ') ?? 'Unknown error'}`, id, job.attributes.errors ?? []);
                case 'pending':
                case 'running':
                    // Still processing, wait and try again
                    await this.sleep(pollInterval);
                    break;
            }
        }
    }
    /**
     * Waits for a job and returns true if successful, false if failed.
     * Does not throw on job failure.
     */
    async waitForCompletion(id, options = {}) {
        try {
            const job = await this.poll(id, options);
            return { success: true, job };
        }
        catch (error) {
            if (error instanceof TrackableJobError) {
                return {
                    success: false,
                    job: {
                        id,
                        type: 'trackable_jobs',
                        attributes: { status: 'error', errors: error.errors },
                    },
                    errors: error.errors,
                };
            }
            throw error;
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=trackableJobs.js.map