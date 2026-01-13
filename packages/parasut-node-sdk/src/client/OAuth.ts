/**
 * OAuth Token Manager
 *
 * Handles OAuth2 authentication with password grant and token refresh.
 * Supports pluggable token storage for persistence.
 */

import { ParasutAuthError, ParasutConfigError, ParasutNetworkError } from './errors.js';

// ============================================================================
// Types
// ============================================================================

export interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

export interface OAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
  tokenType: string;
}

/**
 * Interface for pluggable token storage.
 * Implement this to persist tokens (e.g., to Redis, file, etc.)
 */
export interface TokenStorage {
  get(): Promise<OAuthToken | null>;
  set(token: OAuthToken): Promise<void>;
  clear(): Promise<void>;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// ============================================================================
// In-Memory Token Storage
// ============================================================================

export class MemoryTokenStorage implements TokenStorage {
  private token: OAuthToken | null = null;

  async get(): Promise<OAuthToken | null> {
    return this.token;
  }

  async set(token: OAuthToken): Promise<void> {
    this.token = token;
  }

  async clear(): Promise<void> {
    this.token = null;
  }
}

// ============================================================================
// OAuth Manager
// ============================================================================

export class OAuthManager {
  private readonly tokenUrl: string;
  private readonly credentials: OAuthCredentials;
  private readonly storage: TokenStorage;
  private refreshPromise: Promise<OAuthToken> | null = null;

  /**
   * Buffer time before token expiry to trigger refresh (60 seconds)
   */
  private readonly expiryBuffer = 60_000;

  constructor(
    credentials: OAuthCredentials,
    options?: {
      tokenUrl?: string;
      storage?: TokenStorage;
    }
  ) {
    this.credentials = credentials;
    this.tokenUrl = options?.tokenUrl ?? 'https://api.parasut.com/oauth/token';
    this.storage = options?.storage ?? new MemoryTokenStorage();

    // Validate credentials
    if (!credentials.clientId || !credentials.clientSecret) {
      throw new ParasutConfigError('clientId and clientSecret are required');
    }
    if (!credentials.username || !credentials.password) {
      throw new ParasutConfigError('username and password are required');
    }
  }

  /**
   * Returns a valid access token, refreshing if necessary.
   * Handles concurrent refresh requests to prevent multiple refreshes.
   */
  async getValidToken(): Promise<string> {
    // Check if we have a cached token
    const token = await this.storage.get();

    if (token && this.isTokenValid(token)) {
      return token.accessToken;
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      const refreshedToken = await this.refreshPromise;
      return refreshedToken.accessToken;
    }

    // If we have a refresh token, try to refresh
    if (token?.refreshToken) {
      try {
        const newToken = await this.refreshToken(token.refreshToken);
        return newToken.accessToken;
      } catch (error) {
        // If refresh fails, fall through to password grant
        console.warn('Token refresh failed, attempting password grant');
      }
    }

    // No valid token, perform password grant
    const newToken = await this.authenticate();
    return newToken.accessToken;
  }

  /**
   * Performs password grant authentication.
   */
  async authenticate(): Promise<OAuthToken> {
    // Prevent concurrent authentication attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performPasswordGrant();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Refreshes the token using the refresh token.
   */
  async refreshToken(refreshToken: string): Promise<OAuthToken> {
    // Prevent concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh(refreshToken);

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Clears the stored token.
   */
  async clearToken(): Promise<void> {
    await this.storage.clear();
  }

  /**
   * Checks if a token is still valid.
   */
  private isTokenValid(token: OAuthToken): boolean {
    return Date.now() < token.expiresAt - this.expiryBuffer;
  }

  /**
   * Performs the password grant flow.
   */
  private async performPasswordGrant(): Promise<OAuthToken> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      username: this.credentials.username,
      password: this.credentials.password,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    });

    return this.requestToken(body);
  }

  /**
   * Performs the refresh token flow.
   */
  private async performRefresh(refreshToken: string): Promise<OAuthToken> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      refresh_token: refreshToken,
    });

    return this.requestToken(body);
  }

  /**
   * Makes the token request to the OAuth server.
   */
  private async requestToken(body: URLSearchParams): Promise<OAuthToken> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorDetail: string;
        try {
          const parsed = JSON.parse(errorBody);
          errorDetail = parsed.error_description ?? parsed.error ?? errorBody;
        } catch {
          errorDetail = errorBody;
        }

        throw new ParasutAuthError(
          [{ title: 'Authentication Failed', detail: errorDetail }],
          undefined,
          errorBody
        );
      }

      const data = (await response.json()) as TokenResponse;

      const token: OAuthToken = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        tokenType: data.token_type,
      };

      // Store the new token
      await this.storage.set(token);

      return token;
    } catch (error) {
      if (error instanceof ParasutAuthError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ParasutNetworkError(
          `OAuth request failed: ${error.message}`,
          'OAUTH_ERROR',
          error
        );
      }

      throw error;
    }
  }
}

// ============================================================================
// Authorization Code Flow (for web applications)
// ============================================================================

export interface AuthCodeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tokenUrl?: string;
  authorizeUrl?: string;
  storage?: TokenStorage;
}

export class AuthCodeManager {
  private readonly config: AuthCodeConfig;
  private readonly tokenUrl: string;
  private readonly authorizeUrl: string;
  private readonly storage: TokenStorage;
  private refreshPromise: Promise<OAuthToken> | null = null;
  private readonly expiryBuffer = 60_000;

  constructor(config: AuthCodeConfig) {
    this.config = config;
    this.tokenUrl = config.tokenUrl ?? 'https://api.parasut.com/oauth/token';
    this.authorizeUrl = config.authorizeUrl ?? 'https://api.parasut.com/oauth/authorize';
    this.storage = config.storage ?? new MemoryTokenStorage();
  }

  /**
   * Generates the authorization URL for the user to visit.
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
    });

    if (state) {
      params.set('state', state);
    }

    return `${this.authorizeUrl}?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for tokens.
   */
  async exchangeCode(code: string): Promise<OAuthToken> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      redirect_uri: this.config.redirectUri,
    });

    return this.requestToken(body);
  }

  /**
   * Returns a valid access token, refreshing if necessary.
   */
  async getValidToken(): Promise<string> {
    const token = await this.storage.get();

    if (token && this.isTokenValid(token)) {
      return token.accessToken;
    }

    if (this.refreshPromise) {
      const refreshedToken = await this.refreshPromise;
      return refreshedToken.accessToken;
    }

    if (token?.refreshToken) {
      const newToken = await this.refreshToken(token.refreshToken);
      return newToken.accessToken;
    }

    throw new ParasutAuthError(
      [{ title: 'No Valid Token', detail: 'No token available. Please authenticate first.' }]
    );
  }

  /**
   * Refreshes the token using the refresh token.
   */
  async refreshToken(refreshToken: string): Promise<OAuthToken> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken,
    });

    this.refreshPromise = this.requestToken(body);

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  async clearToken(): Promise<void> {
    await this.storage.clear();
  }

  private isTokenValid(token: OAuthToken): boolean {
    return Date.now() < token.expiresAt - this.expiryBuffer;
  }

  private async requestToken(body: URLSearchParams): Promise<OAuthToken> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorDetail: string;
        try {
          const parsed = JSON.parse(errorBody);
          errorDetail = parsed.error_description ?? parsed.error ?? errorBody;
        } catch {
          errorDetail = errorBody;
        }

        throw new ParasutAuthError(
          [{ title: 'Authentication Failed', detail: errorDetail }],
          undefined,
          errorBody
        );
      }

      const data = (await response.json()) as TokenResponse;

      const token: OAuthToken = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        tokenType: data.token_type,
      };

      await this.storage.set(token);
      return token;
    } catch (error) {
      if (error instanceof ParasutAuthError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ParasutNetworkError(
          `OAuth request failed: ${error.message}`,
          'OAUTH_ERROR',
          error
        );
      }
      throw error;
    }
  }
}
