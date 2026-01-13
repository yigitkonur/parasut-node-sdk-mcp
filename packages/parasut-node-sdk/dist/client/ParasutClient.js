/**
 * Paraşüt Client
 *
 * Main entry point for the Paraşüt SDK.
 * Provides a resource tree for accessing all API endpoints.
 */
import { HttpTransport } from './HttpTransport.js';
import { OAuthManager } from './OAuth.js';
import { RateLimiter, DEFAULT_RATE_LIMIT_CONFIG } from './RateLimiter.js';
import { RetryHandler, DEFAULT_RETRY_CONFIG } from './RetryHandler.js';
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
// Client
// ============================================================================
export class ParasutClient {
    transport;
    /**
     * Rate limiter instance (exposed for advanced use cases).
     */
    rateLimiter;
    /**
     * Retry handler instance (exposed for advanced use cases).
     */
    retryHandler;
    oauth;
    staticToken;
    companyId;
    // Resources (lazy-initialized)
    _trackableJobs;
    _accounts;
    _contacts;
    _products;
    _salesInvoices;
    _salesOffers;
    _purchaseBills;
    _eArchives;
    _eInvoices;
    _eInvoiceInboxes;
    _eSmms;
    _bankFees;
    _salaries;
    _taxes;
    _employees;
    _inventoryLevels;
    _stockMovements;
    _shipmentDocuments;
    _tags;
    _itemCategories;
    _transactions;
    constructor(config) {
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
        }
        else if (config.accessToken !== undefined) {
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
        const transportConfig = {
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
    async getToken() {
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
    getResourceConfig() {
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
    get trackableJobs() {
        if (!this._trackableJobs) {
            this._trackableJobs = new TrackableJobsResource(this.transport, this.companyId);
        }
        return this._trackableJobs;
    }
    /**
     * Accounts - cash and bank accounts.
     */
    get accounts() {
        if (!this._accounts) {
            this._accounts = new AccountsResource(this.getResourceConfig());
        }
        return this._accounts;
    }
    /**
     * Contacts - customers and suppliers.
     */
    get contacts() {
        if (!this._contacts) {
            this._contacts = new ContactsResource(this.getResourceConfig());
        }
        return this._contacts;
    }
    /**
     * Products - goods and services.
     */
    get products() {
        if (!this._products) {
            this._products = new ProductsResource(this.getResourceConfig());
        }
        return this._products;
    }
    /**
     * Sales Invoices - manage sales invoices.
     */
    get salesInvoices() {
        if (!this._salesInvoices) {
            this._salesInvoices = new SalesInvoicesResource(this.getResourceConfig());
        }
        return this._salesInvoices;
    }
    /**
     * Sales Offers - quotes and proposals.
     */
    get salesOffers() {
        if (!this._salesOffers) {
            this._salesOffers = new SalesOffersResource(this.getResourceConfig());
        }
        return this._salesOffers;
    }
    /**
     * Purchase Bills - expenses and supplier invoices.
     */
    get purchaseBills() {
        if (!this._purchaseBills) {
            this._purchaseBills = new PurchaseBillsResource(this.getResourceConfig());
        }
        return this._purchaseBills;
    }
    /**
     * E-Archives - e-archive documents.
     */
    get eArchives() {
        if (!this._eArchives) {
            this._eArchives = new EArchivesResource(this.getResourceConfig(), this.trackableJobs);
        }
        return this._eArchives;
    }
    /**
     * E-Invoices - e-invoice documents.
     */
    get eInvoices() {
        if (!this._eInvoices) {
            this._eInvoices = new EInvoicesResource(this.getResourceConfig(), this.trackableJobs);
        }
        return this._eInvoices;
    }
    /**
     * E-Invoice Inboxes - check if contacts are e-invoice users.
     */
    get eInvoiceInboxes() {
        if (!this._eInvoiceInboxes) {
            this._eInvoiceInboxes = new EInvoiceInboxesResource(this.getResourceConfig());
        }
        return this._eInvoiceInboxes;
    }
    /**
     * E-SMMs - freelancer receipts.
     */
    get eSmms() {
        if (!this._eSmms) {
            this._eSmms = new ESmmsResource(this.getResourceConfig(), this.trackableJobs);
        }
        return this._eSmms;
    }
    /**
     * Bank Fees - bank charges.
     */
    get bankFees() {
        if (!this._bankFees) {
            this._bankFees = new BankFeesResource(this.getResourceConfig());
        }
        return this._bankFees;
    }
    /**
     * Salaries - employee salaries.
     */
    get salaries() {
        if (!this._salaries) {
            this._salaries = new SalariesResource(this.getResourceConfig());
        }
        return this._salaries;
    }
    /**
     * Taxes - tax records.
     */
    get taxes() {
        if (!this._taxes) {
            this._taxes = new TaxesResource(this.getResourceConfig());
        }
        return this._taxes;
    }
    /**
     * Employees - employee records.
     */
    get employees() {
        if (!this._employees) {
            this._employees = new EmployeesResource(this.getResourceConfig());
        }
        return this._employees;
    }
    /**
     * Inventory Levels - stock levels per warehouse.
     */
    get inventoryLevels() {
        if (!this._inventoryLevels) {
            this._inventoryLevels = new InventoryLevelsResource(this.getResourceConfig());
        }
        return this._inventoryLevels;
    }
    /**
     * Stock Movements - stock movement history.
     */
    get stockMovements() {
        if (!this._stockMovements) {
            this._stockMovements = new StockMovementsResource(this.getResourceConfig());
        }
        return this._stockMovements;
    }
    /**
     * Shipment Documents - delivery notes.
     */
    get shipmentDocuments() {
        if (!this._shipmentDocuments) {
            this._shipmentDocuments = new ShipmentDocumentsResource(this.getResourceConfig());
        }
        return this._shipmentDocuments;
    }
    /**
     * Tags - labels for organizing resources.
     */
    get tags() {
        if (!this._tags) {
            this._tags = new TagsResource(this.getResourceConfig());
        }
        return this._tags;
    }
    /**
     * Item Categories - categories for products and expenses.
     */
    get itemCategories() {
        if (!this._itemCategories) {
            this._itemCategories = new ItemCategoriesResource(this.getResourceConfig());
        }
        return this._itemCategories;
    }
    /**
     * Transactions - financial transactions.
     */
    get transactions() {
        if (!this._transactions) {
            this._transactions = new TransactionsResource(this.getResourceConfig());
        }
        return this._transactions;
    }
}
//# sourceMappingURL=ParasutClient.js.map