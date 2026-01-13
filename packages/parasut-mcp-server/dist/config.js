/**
 * Configuration
 *
 * Loads configuration from environment variables.
 * All Paraşüt credentials must be provided via environment.
 */
function getEnv(name, required = false) {
    const value = process.env[name];
    if (required && !value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function getEnvInt(name, required = false) {
    const value = getEnv(name, required);
    if (value === undefined)
        return undefined;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${name} must be a valid integer`);
    }
    return parsed;
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
export function loadConfig() {
    const baseUrl = getEnv('PARASUT_BASE_URL');
    return {
        parasut: {
            companyId: getEnvInt('PARASUT_COMPANY_ID', true),
            clientId: getEnv('PARASUT_CLIENT_ID', true),
            clientSecret: getEnv('PARASUT_CLIENT_SECRET', true),
            username: getEnv('PARASUT_USERNAME', true),
            password: getEnv('PARASUT_PASSWORD', true),
            ...(baseUrl !== undefined && { baseUrl }),
        },
        debug: getEnv('DEBUG') === 'true',
    };
}
/**
 * Validates that all required configuration is present.
 * Call this early to fail fast on missing config.
 */
export function validateConfig(config) {
    const { parasut } = config;
    if (parasut.companyId <= 0) {
        throw new Error('PARASUT_COMPANY_ID must be a positive integer');
    }
    if (!parasut.clientId.trim()) {
        throw new Error('PARASUT_CLIENT_ID cannot be empty');
    }
    if (!parasut.clientSecret.trim()) {
        throw new Error('PARASUT_CLIENT_SECRET cannot be empty');
    }
    if (!parasut.username.trim()) {
        throw new Error('PARASUT_USERNAME cannot be empty');
    }
    if (!parasut.password.trim()) {
        throw new Error('PARASUT_PASSWORD cannot be empty');
    }
}
//# sourceMappingURL=config.js.map