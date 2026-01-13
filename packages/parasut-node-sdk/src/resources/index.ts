/**
 * Resource Exports
 */

export { BaseResource, type ResourceConfig, type PaginatedResponse, type IterateOptions } from './BaseResource.js';
export { TrackableJobsResource, TrackableJobError, TrackableJobTimeoutError, type PollOptions } from './trackableJobs.js';

// Core resources
export { AccountsResource, type Account, type AccountAttributes, type AccountFilters } from './accounts.js';
export { ContactsResource, type Contact, type ContactAttributes, type ContactFilters } from './contacts.js';
export { ProductsResource, type Product, type ProductAttributes, type ProductFilters } from './products.js';

// Sales
export { SalesInvoicesResource, type SalesInvoice, type SalesInvoiceAttributes, type SalesInvoiceFilters } from './salesInvoices.js';
export { SalesOffersResource, type SalesOffer, type SalesOfferAttributes, type SalesOfferFilters } from './salesOffers.js';

// Purchases
export { PurchaseBillsResource, type PurchaseBill, type PurchaseBillAttributes, type PurchaseBillFilters } from './purchaseBills.js';

// E-Documents
export { EArchivesResource, type EArchive, type EArchiveAttributes, type EArchiveFilters } from './eArchives.js';
export { EInvoicesResource, type EInvoice, type EInvoiceAttributes, type EInvoiceFilters } from './eInvoices.js';
export { EInvoiceInboxesResource, type EInvoiceInbox, type EInvoiceInboxAttributes, type EInvoiceInboxFilters } from './eInvoiceInboxes.js';
export { ESmmsResource, type ESmm, type ESmmAttributes, type ESmmFilters } from './eSmms.js';

// Expenses
export { BankFeesResource, type BankFee, type BankFeeAttributes, type BankFeeFilters } from './bankFees.js';
export { SalariesResource, type Salary, type SalaryAttributes, type SalaryFilters } from './salaries.js';
export { TaxesResource, type Tax, type TaxAttributes, type TaxFilters } from './taxes.js';

// HR
export { EmployeesResource, type Employee, type EmployeeAttributes, type EmployeeFilters } from './employees.js';

// Inventory
export { InventoryLevelsResource, type InventoryLevel, type InventoryLevelAttributes, type InventoryLevelFilters } from './inventoryLevels.js';
export { StockMovementsResource, type StockMovement, type StockMovementAttributes, type StockMovementFilters } from './stockMovements.js';
export { ShipmentDocumentsResource, type ShipmentDocument, type ShipmentDocumentAttributes, type ShipmentDocumentFilters } from './shipmentDocuments.js';

// Settings
export { TagsResource, type Tag, type TagAttributes, type TagFilters } from './tags.js';
export { ItemCategoriesResource, type ItemCategory, type ItemCategoryAttributes, type ItemCategoryFilters } from './itemCategories.js';

// Financial
export { TransactionsResource, type Transaction, type TransactionAttributes, type TransactionFilters } from './transactions.js';
