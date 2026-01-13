/**
 * Tool Registry
 *
 * Registers all tools and dispatches tool calls to handlers.
 */
// Import tool definitions
import { contactTools, handleSearchContacts, handleGetContact, handleCreateContact, handleUpdateContact } from './contacts.js';
import { invoiceTools, handleSearchInvoices, handleGetInvoice, handleCreateInvoice, handleCancelInvoice, handleRecoverInvoice, handleInvoicePdf, handleRecordInvoicePayment } from './invoices.js';
import { billTools, handleSearchBills, handleGetBill, handleCreateBill, handleRecordBillPayment } from './bills.js';
import { productTools, handleSearchProducts, handleGetProduct, handleCreateProduct, handleUpdateProduct } from './products.js';
import { edocumentTools, handleCheckEInvoiceInbox, handleSendEInvoice, handleSendEArchive, handleSendESmm } from './edocuments.js';
import { financialTools, handleListAccounts, handleSearchTransactions, handleCreateBankFee, handleGetFinancialSummary } from './financial.js';
import { inventoryTools, handleGetStockLevels, handleSearchStockMovements } from './inventory.js';
import { organizationTools, handleListCategories, handleListTags, handleListEmployees, handleCreateSalary, handleCreateTax } from './organization.js';
// ============================================================================
// Tool Registry
// ============================================================================
/**
 * Returns all registered tools.
 */
export function getAllTools() {
    return [
        ...contactTools,
        ...invoiceTools,
        ...billTools,
        ...productTools,
        ...edocumentTools,
        ...financialTools,
        ...inventoryTools,
        ...organizationTools,
    ];
}
const handlers = {
    // Contacts
    search_contacts: handleSearchContacts,
    get_contact: handleGetContact,
    create_contact: handleCreateContact,
    update_contact: handleUpdateContact,
    // Invoices
    search_invoices: handleSearchInvoices,
    get_invoice: handleGetInvoice,
    create_invoice: handleCreateInvoice,
    cancel_invoice: handleCancelInvoice,
    recover_invoice: handleRecoverInvoice,
    invoice_pdf: handleInvoicePdf,
    record_invoice_payment: handleRecordInvoicePayment,
    // Bills
    search_bills: handleSearchBills,
    get_bill: handleGetBill,
    create_bill: handleCreateBill,
    record_bill_payment: handleRecordBillPayment,
    // Products
    search_products: handleSearchProducts,
    get_product: handleGetProduct,
    create_product: handleCreateProduct,
    update_product: handleUpdateProduct,
    // E-Documents
    check_einvoice_inbox: handleCheckEInvoiceInbox,
    send_einvoice: handleSendEInvoice,
    send_earchive: handleSendEArchive,
    send_esmm: handleSendESmm,
    // Financial
    list_accounts: handleListAccounts,
    search_transactions: handleSearchTransactions,
    create_bank_fee: handleCreateBankFee,
    get_financial_summary: handleGetFinancialSummary,
    // Inventory
    get_stock_levels: handleGetStockLevels,
    search_stock_movements: handleSearchStockMovements,
    // Organization
    list_categories: handleListCategories,
    list_tags: handleListTags,
    list_employees: handleListEmployees,
    create_salary: handleCreateSalary,
    create_tax: handleCreateTax,
};
// ============================================================================
// Dispatcher
// ============================================================================
/**
 * Handles a tool call by dispatching to the appropriate handler.
 */
export async function handleToolCall(name, args) {
    const handler = handlers[name];
    if (!handler) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: Unknown tool "${name}"\n\nAvailable tools:\n${Object.keys(handlers).map(t => `- ${t}`).join('\n')}`,
                },
            ],
            isError: true,
        };
    }
    try {
        return await handler(args);
    }
    catch (error) {
        // Catch any unhandled errors
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error executing ${name}: ${message}\n\nThis may be a bug. Please try again or check your parameters.`,
                },
            ],
            isError: true,
        };
    }
}
// ============================================================================
// Tool Count Summary
// ============================================================================
/**
 * Returns a summary of registered tools by category.
 */
export function getToolSummary() {
    return {
        contacts: contactTools.length,
        invoices: invoiceTools.length,
        bills: billTools.length,
        products: productTools.length,
        edocuments: edocumentTools.length,
        financial: financialTools.length,
        inventory: inventoryTools.length,
        organization: organizationTools.length,
        total: getAllTools().length,
    };
}
//# sourceMappingURL=index.js.map