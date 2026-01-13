/**
 * Trackable Jobs Resource
 *
 * Handles async job tracking for e-Invoice, e-Archive, and e-Smm creation.
 */
import type { HttpTransport } from '../client/HttpTransport.js';
import type { JsonApiResponse } from '../generated/types.js';
export type JobStatus = 'pending' | 'running' | 'done' | 'error';
export interface TrackableJobAttributes {
    status: JobStatus;
    errors?: string[];
}
export interface TrackableJob {
    id: string;
    type: 'trackable_jobs';
    attributes: TrackableJobAttributes;
}
export interface PollOptions {
    /**
     * Interval between poll attempts in milliseconds.
     * @default 2000
     */
    pollInterval?: number;
    /**
     * Maximum time to wait for job completion in milliseconds.
     * @default 60000 (1 minute)
     */
    timeout?: number;
}
export declare class TrackableJobError extends Error {
    readonly jobId: string;
    readonly errors: string[];
    constructor(message: string, jobId: string, errors: string[]);
}
export declare class TrackableJobTimeoutError extends Error {
    readonly jobId: string;
    readonly lastStatus: JobStatus;
    constructor(jobId: string, lastStatus: JobStatus, timeoutMs: number);
}
export declare class TrackableJobsResource {
    private readonly transport;
    private readonly companyId;
    constructor(transport: HttpTransport, companyId: number);
    /**
     * Gets the current status of a trackable job.
     */
    get(id: string): Promise<JsonApiResponse<TrackableJob>>;
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
    poll(id: string, options?: PollOptions): Promise<TrackableJob>;
    /**
     * Waits for a job and returns true if successful, false if failed.
     * Does not throw on job failure.
     */
    waitForCompletion(id: string, options?: PollOptions): Promise<{
        success: boolean;
        job: TrackableJob;
        errors?: string[];
    }>;
    private sleep;
}
//# sourceMappingURL=trackableJobs.d.ts.map