/**
 * Paraşüt SDK Client
 *
 * Singleton client for the Paraşüt API.
 * Initialized once at server startup and reused for all tool calls.
 */
import { ParasutClient } from '@yigitkonur/parasut-node-sdk';
import type { ParasutConfig } from './config.js';
/**
 * Initializes the Paraşüt client singleton.
 * Must be called once at server startup with valid configuration.
 */
export declare function initializeClient(config: ParasutConfig): ParasutClient;
/**
 * Gets the Paraşüt client singleton.
 * Throws if client has not been initialized.
 */
export declare function getClient(): ParasutClient;
/**
 * Resets the client singleton.
 * Primarily used for testing.
 */
export declare function resetClient(): void;
//# sourceMappingURL=client.d.ts.map