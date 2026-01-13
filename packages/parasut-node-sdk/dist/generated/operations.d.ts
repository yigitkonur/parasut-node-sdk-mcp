/**
 * Auto-generated operation metadata from Paraşüt Swagger spec.
 * DO NOT EDIT MANUALLY - run `npm run generate` instead.
 */
export interface OperationMeta {
    operationId: string;
    method: string;
    path: string;
    tag: string;
    summary: string;
    hasCompanyId: boolean;
    pathParams: string[];
    successStatus: number;
}
export declare const OPERATIONS: Record<string, OperationMeta>;
/** Operations grouped by resource tag */
export declare const OPERATIONS_BY_TAG: Record<string, string[]>;
export interface AccountsFilters {
    /**  */
    name?: string;
    /**  */
    currency?: string;
    /**  */
    bank_name?: string;
    /**  */
    bank_branch?: string;
    /**  */
    account_type?: string;
    /**  */
    iban?: string;
}
export interface ContactsFilters {
    /**  */
    name?: string;
    /**  */
    email?: string;
    /**  */
    tax_number?: string;
    /**  */
    tax_office?: string;
    /**  */
    city?: string;
    /** Available: *customer, supplier*
   */
    account_type?: string;
}
export interface EInvoiceInboxesFilters {
    /**  */
    vkn?: number;
}
export interface EmployeesFilters {
    /**  */
    name?: string;
    /**  */
    email?: string;
}
export interface InventoryLevelsFilters {
    /** Sonuçların filtrelenmesini istediğiniz depo ismi. */
    'warehouses.name': string;
    /**  */
    archived?: boolean;
    /**  */
    has_stock?: boolean;
    /**  */
    stock_count?: number;
}
export interface ItemCategoriesFilters {
    /**  */
    name?: string;
    /**  */
    category_type?: string;
}
export interface ProductsFilters {
    /**  */
    name?: string;
    /**  */
    code?: string;
}
export interface PurchaseBillsFilters {
    /**  */
    issue_date?: string;
    /**  */
    due_date?: string;
    /**  */
    supplier_id?: number;
    /** Available: *purchase_bill, refund, cancelled*
   */
    item_type?: string;
    /**  */
    spender_id?: number;
}
export interface SalariesFilters {
    /**  */
    due_date?: string;
    /**  */
    issue_date?: string;
    /**  */
    currency?: string;
    /**  */
    remaining?: number;
}
export interface SalesInvoicesFilters {
    /**  */
    issue_date?: string;
    /**  */
    due_date?: string;
    /**  */
    contact_id?: number;
    /**  */
    invoice_id?: number;
    /**  */
    invoice_series?: string;
    /** Default value is *'invoice, refund, estimate'*. Available: *invoice, refund, estimate, export*
   */
    item_type?: string;
    /** Available: *printed, not_printed, invoices_not_sent, e_invoice_sent, e_archive_sent, e_smm_sent*
   */
    print_status?: string;
    /** Available: *overdue, not_due, unscheduled, paid*
   */
    payment_status?: string;
}
export interface SalesOffersFilters {
    /**  */
    archived?: boolean;
    /**  */
    query?: string;
    /**  */
    invoice_status?: string;
    /**  */
    status?: string;
}
export interface ShipmentDocumentsFilters {
    /**  */
    flow_type?: string;
    /**  */
    invoice_status?: string;
    /**  */
    archived?: boolean;
}
export interface TaxesFilters {
    /**  */
    due_date?: string;
    /**  */
    issue_date?: string;
    /**  */
    currency?: string;
    /**  */
    remaining?: number;
}
export interface WarehousesFilters {
    /**  */
    name?: string;
    /**  */
    archived?: boolean;
}
//# sourceMappingURL=operations.d.ts.map