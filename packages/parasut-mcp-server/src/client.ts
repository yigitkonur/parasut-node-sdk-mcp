/**
 * Paraşüt SDK Client
 *
 * Singleton client for the Paraşüt API.
 * Initialized once at server startup and reused for all tool calls.
 */

import { ParasutClient } from '@yigitkonur/parasut-node-sdk';
import type { ParasutConfig } from './config.js';

let client: ParasutClient | null = null;

/**
 * Initializes the Paraşüt client singleton.
 * Must be called once at server startup with valid configuration.
 */
export function initializeClient(config: ParasutConfig): ParasutClient {
  if (client) {
    return client;
  }

  client = new ParasutClient({
    companyId: config.companyId,
    credentials: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      username: config.username,
      password: config.password,
    },
    ...(config.baseUrl !== undefined && { baseUrl: config.baseUrl }),
  });

  return client;
}

/**
 * Gets the Paraşüt client singleton.
 * Throws if client has not been initialized.
 */
export function getClient(): ParasutClient {
  if (!client) {
    throw new Error(
      'Paraşüt client not initialized. Call initializeClient() first.'
    );
  }
  return client;
}

/**
 * Resets the client singleton.
 * Primarily used for testing.
 */
export function resetClient(): void {
  client = null;
}
