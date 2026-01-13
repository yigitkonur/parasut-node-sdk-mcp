/**
 * Paraşüt Client
 *
 * Main entry point for the Paraşüt SDK.
 * Provides a resource tree for accessing all API endpoints.
 */

import { HttpTransport, type TransportConfig } from './HttpTransport.js';
import { OAuthManager, type OAuthCredentials, type TokenStorage } from './OAuth.js';
import { RateLimiter, type RateLimitConfig, DEFAULT_RATE_LIMIT_CONFIG } from './RateLimiter.js';
import { RetryHandler, type RetryConfig, DEFAULT_RETRY_CONFIG } from './RetryHandler.js';
import { ParasutConfigError, ParasutAuthError } from './errors.js';

// Resources
import { TrackableJobsResource } from '../resources/trackableJobs.js';
import { AccountsResource } from '../resources/accounts.js';
import { ContactsResource } from '../resources/contacts.js';
import { ProductsResource } from '../resources/products.js';
import { SalesInvoicesResource } from '../resources/salesInvoices.js';
import { SalesOffersResource } from '../resources/salesOffers.js';
import { PurchaseBillsResource } from '../resources/purchaseBills.js';
import { EArchivesResource } from '../resources/eArchives.js';
import { EInvoicesResource } from '../resources/eInvoices.js';
import { EInvoiceInboxesResource } from '../resources/eInvoiceInboxes.js';
import { ESmmsResource } from '../resources/eSmms.js';
import { BankFeesResource } from '../resources/bankFees.js';
import { SalariesResource } from '../resources/salaries.js';
import { TaxesResource } from '../resources/taxes.js';
import { EmployeesResource } from '../resources/employees.js';
import { InventoryLevelsResource } from '../resources/inventoryLevels.js';
import { StockMovementsResource } from '../resources/stockMovements.js';
import { ShipmentDocumentsResource } from '../resources/shipmentDocuments.js';
import { TagsResource } from '../resources/tags.js';
import { ItemCategoriesResource } from '../resources/itemCategories.js';
import { TransactionsResource } from '../resources/transactions.js';

// ============================================================================
// Configuration
// ============================================================================

export interface ParasutClientConfig {
  /**
   * Company ID (Firma ID) to use for API requests.
   */
  companyId: number;

  /**
   * OAuth credentials for authentication.
   * Required unless accessToken is provided.
   */
  credentials?: OAuthCredentials;

  /**
   * Static access token.
   * Use this for testing or when you manage tokens yourself.
   */
  accessToken?: string;

  /**
   * Base URL for the API.
   * @default 'https://api.parasut.com/v4'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;

  /**
   * Custom token storage for persisting OAuth tokens.
   * Defaults to in-memory storage.
   */
  tokenStorage?: TokenStorage;

  /**
   * Rate limiting configuration.
   */
  rateLimit?: Partial<RateLimitConfig>;

  /**
   * Retry configuration.
   */
  retry?: Partial<RetryConfig>;
}

// ============================================================================
// Client
// ============================================================================

export class ParasutClient {
  private readonly transport: HttpTransport;
  /**
   * Rate limiter instance (exposed for advanced use cases).
   */
  readonly rateLimiter: RateLimiter;
  /**
   * Retry handler instance (exposed for advanced use cases).
   */
  readonly retryHandler: RetryHandler;
  private readonly oauth?: OAuthManager;
  private readonly staticToken?: string;
  private readonly companyId: number;

  // Resources (lazy-initialized)
  private _trackableJobs?: TrackableJobsResource;
  private _accounts?: AccountsResource;
  private _contacts?: ContactsResource;
  private _products?: ProductsResource;
  private _salesInvoices?: SalesInvoicesResource;
  private _salesOffers?: SalesOffersResource;
  private _purchaseBills?: PurchaseBillsResource;
  private _eArchives?: EArchivesResource;
  private _eInvoices?: EInvoicesResource;
  private _eInvoiceInboxes?: EInvoiceInboxesResource;
  private _eSmms?: ESmmsResource;
  private _bankFees?: BankFeesResource;
  private _salaries?: SalariesResource;
  private _taxes?: TaxesResource;
  private _employees?: EmployeesResource;
  private _inventoryLevels?: InventoryLevelsResource;
  private _stockMovements?: StockMovementsResource;
  private _shipmentDocuments?: ShipmentDocumentsResource;
  private _tags?: TagsResource;
  private _itemCategories?: ItemCategoriesResource;
  private _transactions?: TransactionsResource;

  constructor(config: ParasutClientConfig) {
    // Validate configuration
    if (!config.companyId) {
      throw new ParasutConfigError('companyId is required');
    }

    if (!config.credentials && !config.accessToken) {
      throw new ParasutConfigError('Either credentials or accessToken is required');
    }

    this.companyId = config.companyId;

    // Set up authentication
    if (config.credentials) {
      this.oauth = new OAuthManager(config.credentials, {
        ...(config.tokenStorage !== undefined && { storage: config.tokenStorage }),
      });
    } else if (config.accessToken !== undefined) {
      this.staticToken = config.accessToken;
    }

    // Set up rate limiter
    this.rateLimiter = new RateLimiter({
      ...DEFAULT_RATE_LIMIT_CONFIG,
      ...config.rateLimit,
    });

    // Set up retry handler
    this.retryHandler = new RetryHandler({
      ...DEFAULT_RETRY_CONFIG,
      ...config.retry,
    });

    // Set up transport
    const transportConfig: TransportConfig = {
      baseUrl: config.baseUrl ?? 'https://api.parasut.com/v4',
      timeout: config.timeout ?? 30_000,
    };

    this.transport = new HttpTransport(transportConfig);

    // Add auth interceptor
    this.transport.addRequestInterceptor(async (requestConfig) => {
      const token = await this.getToken();
      return {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    });
  }

  /**
   * Gets a valid access token.
   */
  private async getToken(): Promise<string> {
    if (this.staticToken) {
      return this.staticToken;
    }

    if (this.oauth) {
      return this.oauth.getValidToken();
    }

    throw new ParasutAuthError([
      { title: 'No Token', detail: 'No authentication method configured' },
    ]);
  }

  /**
   * Creates a resource config.
   */
  private getResourceConfig() {
    return {
      transport: this.transport,
      companyId: this.companyId,
    };
  }

  // ============================================================================
  // Resource Accessors
  // ============================================================================

  /**
   * Trackable Jobs - for monitoring async operations.
   */
  get trackableJobs(): TrackableJobsResource {
    if (!this._trackableJobs) {
      this._trackableJobs = new TrackableJobsResource(this.transport, this.companyId);
    }
    return this._trackableJobs;
  }

  /**
   * Accounts - cash and bank accounts.
   */
  get accounts(): AccountsResource {
    if (!this._accounts) {
      this._accounts = new AccountsResource(this.getResourceConfig());
    }
    return this._accounts;
  }

  /**
   * Contacts - customers and suppliers.
   */
  get contacts(): ContactsResource {
    if (!this._contacts) {
      this._contacts = new ContactsResource(this.getResourceConfig());
    }
    return this._contacts;
  }

  /**
   * Products - goods and services.
   */
  get products(): ProductsResource {
    if (!this._products) {
      this._products = new ProductsResource(this.getResourceConfig());
    }
    return this._products;
  }

  /**
   * Sales Invoices - manage sales invoices.
   */
  get salesInvoices(): SalesInvoicesResource {
    if (!this._salesInvoices) {
      this._salesInvoices = new SalesInvoicesResource(this.getResourceConfig());
    }
    return this._salesInvoices;
  }

  /**
   * Sales Offers - quotes and proposals.
   */
  get salesOffers(): SalesOffersResource {
    if (!this._salesOffers) {
      this._salesOffers = new SalesOffersResource(this.getResourceConfig());
    }
    return this._salesOffers;
  }

  /**
   * Purchase Bills - expenses and supplier invoices.
   */
  get purchaseBills(): PurchaseBillsResource {
    if (!this._purchaseBills) {
      this._purchaseBills = new PurchaseBillsResource(this.getResourceConfig());
    }
    return this._purchaseBills;
  }

  /**
   * E-Archives - e-archive documents.
   */
  get eArchives(): EArchivesResource {
    if (!this._eArchives) {
      this._eArchives = new EArchivesResource(this.getResourceConfig(), this.trackableJobs);
    }
    return this._eArchives;
  }

  /**
   * E-Invoices - e-invoice documents.
   */
  get eInvoices(): EInvoicesResource {
    if (!this._eInvoices) {
      this._eInvoices = new EInvoicesResource(this.getResourceConfig(), this.trackableJobs);
    }
    return this._eInvoices;
  }

  /**
   * E-Invoice Inboxes - check if contacts are e-invoice users.
   */
  get eInvoiceInboxes(): EInvoiceInboxesResource {
    if (!this._eInvoiceInboxes) {
      this._eInvoiceInboxes = new EInvoiceInboxesResource(this.getResourceConfig());
    }
    return this._eInvoiceInboxes;
  }

  /**
   * E-SMMs - freelancer receipts.
   */
  get eSmms(): ESmmsResource {
    if (!this._eSmms) {
      this._eSmms = new ESmmsResource(this.getResourceConfig(), this.trackableJobs);
    }
    return this._eSmms;
  }

  /**
   * Bank Fees - bank charges.
   */
  get bankFees(): BankFeesResource {
    if (!this._bankFees) {
      this._bankFees = new BankFeesResource(this.getResourceConfig());
    }
    return this._bankFees;
  }

  /**
   * Salaries - employee salaries.
   */
  get salaries(): SalariesResource {
    if (!this._salaries) {
      this._salaries = new SalariesResource(this.getResourceConfig());
    }
    return this._salaries;
  }

  /**
   * Taxes - tax records.
   */
  get taxes(): TaxesResource {
    if (!this._taxes) {
      this._taxes = new TaxesResource(this.getResourceConfig());
    }
    return this._taxes;
  }

  /**
   * Employees - employee records.
   */
  get employees(): EmployeesResource {
    if (!this._employees) {
      this._employees = new EmployeesResource(this.getResourceConfig());
    }
    return this._employees;
  }

  /**
   * Inventory Levels - stock levels per warehouse.
   */
  get inventoryLevels(): InventoryLevelsResource {
    if (!this._inventoryLevels) {
      this._inventoryLevels = new InventoryLevelsResource(this.getResourceConfig());
    }
    return this._inventoryLevels;
  }

  /**
   * Stock Movements - stock movement history.
   */
  get stockMovements(): StockMovementsResource {
    if (!this._stockMovements) {
      this._stockMovements = new StockMovementsResource(this.getResourceConfig());
    }
    return this._stockMovements;
  }

  /**
   * Shipment Documents - delivery notes.
   */
  get shipmentDocuments(): ShipmentDocumentsResource {
    if (!this._shipmentDocuments) {
      this._shipmentDocuments = new ShipmentDocumentsResource(this.getResourceConfig());
    }
    return this._shipmentDocuments;
  }

  /**
   * Tags - labels for organizing resources.
   */
  get tags(): TagsResource {
    if (!this._tags) {
      this._tags = new TagsResource(this.getResourceConfig());
    }
    return this._tags;
  }

  /**
   * Item Categories - categories for products and expenses.
   */
  get itemCategories(): ItemCategoriesResource {
    if (!this._itemCategories) {
      this._itemCategories = new ItemCategoriesResource(this.getResourceConfig());
    }
    return this._itemCategories;
  }

  /**
   * Transactions - financial transactions.
   */
  get transactions(): TransactionsResource {
    if (!this._transactions) {
      this._transactions = new TransactionsResource(this.getResourceConfig());
    }
    return this._transactions;
  }
}
