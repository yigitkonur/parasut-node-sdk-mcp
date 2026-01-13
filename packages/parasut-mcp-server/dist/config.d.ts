/**
 * Configuration
 *
 * Loads configuration from environment variables.
 * All Paraşüt credentials must be provided via environment.
 */
export interface ParasutConfig {
    companyId: number;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    baseUrl?: string;
}
export interface ServerConfig {
    parasut: ParasutConfig;
    debug: boolean;
}
/**
 * Loads configuration from environment variables.
 *
 * Required environment variables:
 * - PARASUT_COMPANY_ID: Your Paraşüt company ID (firma ID)
 * - PARASUT_CLIENT_ID: OAuth client ID
 * - PARASUT_CLIENT_SECRET: OAuth client secret
 * - PARASUT_USERNAME: Your Paraşüt username (email)
 * - PARASUT_PASSWORD: Your Paraşüt password
 *
 * Optional:
 * - PARASUT_BASE_URL: API base URL (default: https://api.parasut.com/v4)
 * - DEBUG: Enable debug logging (default: false)
 */
export declare function loadConfig(): ServerConfig;
/**
 * Validates that all required configuration is present.
 * Call this early to fail fast on missing config.
 */
export declare function validateConfig(config: ServerConfig): void;
//# sourceMappingURL=config.d.ts.map