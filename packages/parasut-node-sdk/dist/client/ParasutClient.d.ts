/**
 * Paraşüt Client
 *
 * Main entry point for the Paraşüt SDK.
 * Provides a resource tree for accessing all API endpoints.
 */
import { type OAuthCredentials, type TokenStorage } from './OAuth.js';
import { RateLimiter, type RateLimitConfig } from './RateLimiter.js';
import { RetryHandler, type RetryConfig } from './RetryHandler.js';
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
export declare class ParasutClient {
    private readonly transport;
    /**
     * Rate limiter instance (exposed for advanced use cases).
     */
    readonly rateLimiter: RateLimiter;
    /**
     * Retry handler instance (exposed for advanced use cases).
     */
    readonly retryHandler: RetryHandler;
    private readonly oauth?;
    private readonly staticToken?;
    private readonly companyId;
    private _trackableJobs?;
    private _accounts?;
    private _contacts?;
    private _products?;
    private _salesInvoices?;
    private _salesOffers?;
    private _purchaseBills?;
    private _eArchives?;
    private _eInvoices?;
    private _eInvoiceInboxes?;
    private _eSmms?;
    private _bankFees?;
    private _salaries?;
    private _taxes?;
    private _employees?;
    private _inventoryLevels?;
    private _stockMovements?;
    private _shipmentDocuments?;
    private _tags?;
    private _itemCategories?;
    private _transactions?;
    constructor(config: ParasutClientConfig);
    /**
     * Gets a valid access token.
     */
    private getToken;
    /**
     * Creates a resource config.
     */
    private getResourceConfig;
    /**
     * Trackable Jobs - for monitoring async operations.
     */
    get trackableJobs(): TrackableJobsResource;
    /**
     * Accounts - cash and bank accounts.
     */
    get accounts(): AccountsResource;
    /**
     * Contacts - customers and suppliers.
     */
    get contacts(): ContactsResource;
    /**
     * Products - goods and services.
     */
    get products(): ProductsResource;
    /**
     * Sales Invoices - manage sales invoices.
     */
    get salesInvoices(): SalesInvoicesResource;
    /**
     * Sales Offers - quotes and proposals.
     */
    get salesOffers(): SalesOffersResource;
    /**
     * Purchase Bills - expenses and supplier invoices.
     */
    get purchaseBills(): PurchaseBillsResource;
    /**
     * E-Archives - e-archive documents.
     */
    get eArchives(): EArchivesResource;
    /**
     * E-Invoices - e-invoice documents.
     */
    get eInvoices(): EInvoicesResource;
    /**
     * E-Invoice Inboxes - check if contacts are e-invoice users.
     */
    get eInvoiceInboxes(): EInvoiceInboxesResource;
    /**
     * E-SMMs - freelancer receipts.
     */
    get eSmms(): ESmmsResource;
    /**
     * Bank Fees - bank charges.
     */
    get bankFees(): BankFeesResource;
    /**
     * Salaries - employee salaries.
     */
    get salaries(): SalariesResource;
    /**
     * Taxes - tax records.
     */
    get taxes(): TaxesResource;
    /**
     * Employees - employee records.
     */
    get employees(): EmployeesResource;
    /**
     * Inventory Levels - stock levels per warehouse.
     */
    get inventoryLevels(): InventoryLevelsResource;
    /**
     * Stock Movements - stock movement history.
     */
    get stockMovements(): StockMovementsResource;
    /**
     * Shipment Documents - delivery notes.
     */
    get shipmentDocuments(): ShipmentDocumentsResource;
    /**
     * Tags - labels for organizing resources.
     */
    get tags(): TagsResource;
    /**
     * Item Categories - categories for products and expenses.
     */
    get itemCategories(): ItemCategoriesResource;
    /**
     * Transactions - financial transactions.
     */
    get transactions(): TransactionsResource;
}
//# sourceMappingURL=ParasutClient.d.ts.map