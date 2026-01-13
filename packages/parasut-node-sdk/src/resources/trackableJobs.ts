/**
 * Trackable Jobs Resource
 *
 * Handles async job tracking for e-Invoice, e-Archive, and e-Smm creation.
 */

import type { HttpTransport } from '../client/HttpTransport.js';
import type { JsonApiResponse } from '../generated/types.js';

// ============================================================================
// Types
// ============================================================================

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

export class TrackableJobError extends Error {
  constructor(
    message: string,
    public readonly jobId: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = 'TrackableJobError';
  }
}

export class TrackableJobTimeoutError extends Error {
  constructor(
    public readonly jobId: string,
    public readonly lastStatus: JobStatus,
    timeoutMs: number
  ) {
    super(`Job ${jobId} timed out after ${timeoutMs}ms (status: ${lastStatus})`);
    this.name = 'TrackableJobTimeoutError';
  }
}

// ============================================================================
// Resource
// ============================================================================

export class TrackableJobsResource {
  private readonly transport: HttpTransport;
  private readonly companyId: number;

  constructor(transport: HttpTransport, companyId: number) {
    this.transport = transport;
    this.companyId = companyId;
  }

  /**
   * Gets the current status of a trackable job.
   */
  async get(id: string): Promise<JsonApiResponse<TrackableJob>> {
    return this.transport.get<JsonApiResponse<TrackableJob>>(
      `/${this.companyId}/trackable_jobs/${id}`
    );
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
  async poll(id: string, options: PollOptions = {}): Promise<TrackableJob> {
    const {
      pollInterval = 2000,
      timeout = 60_000,
    } = options;

    const startTime = Date.now();
    let lastStatus: JobStatus = 'pending';

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
          throw new TrackableJobError(
            `Job ${id} failed: ${job.attributes.errors?.join(', ') ?? 'Unknown error'}`,
            id,
            job.attributes.errors ?? []
          );

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
  async waitForCompletion(
    id: string,
    options: PollOptions = {}
  ): Promise<{ success: boolean; job: TrackableJob; errors?: string[] }> {
    try {
      const job = await this.poll(id, options);
      return { success: true, job };
    } catch (error) {
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

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
