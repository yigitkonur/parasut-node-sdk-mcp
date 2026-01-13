/**
 * Auto-generated TypeScript types from Paraşüt Swagger spec.
 * DO NOT EDIT MANUALLY - run `npm run generate` instead.
 */

// ============================================================================
// Common Types
// ============================================================================

/** Pagination metadata for list responses */
export interface ListMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
}

/** API error response */
export interface ApiError {
  title: string;
  detail: string;
}

/** JSON:API relationship (single) */
export interface Relationship {
  data: {
    id: string;
    type: string;
  } | null;
}

/** JSON:API relationship (multiple) */
export interface RelationshipMany {
  data: Array<{
    id: string;
    type: string;
  }>;
}

/** Base JSON:API resource */
export interface JsonApiResource<TAttributes = object, TRelationships = object> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: TRelationships;
}

/** JSON:API single resource response */
export interface JsonApiResponse<T> {
  data: T;
  included?: JsonApiResource[];
}

/** JSON:API list response */
export interface JsonApiListResponse<T> {
  data: T[];
  meta: ListMeta;
  included?: JsonApiResource[];
}

// ============================================================================
// Resource Types (Generated from definitions)
// ============================================================================

export interface Account {
  id?: string;
  /** Type of the resource */
  type?: 'accounts';
  attributes: AccountAttributes;
  relationships?: string;
}

export interface AccountAttributes {
  readonly used_for?: string;
  readonly last_used_at?: string;
  /** Bakiye */
  readonly balance?: number;
  readonly last_adjustment_date?: string;
  readonly bank_integration_type?: string;
  readonly associate_email?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Hesap ismi */
  name: string;
  /** Döviz cinsi */
  currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  /** Hesap tipi */
  account_type?: 'cash' | 'bank' | 'sys';
  /** Banka ismi */
  bank_name?: string;
  /** Banka şubesi */
  bank_branch?: string;
  /** Banka hesap no */
  bank_account_no?: string;
  /** IBAN */
  iban?: string;
  archived?: boolean;
}

export interface AccountDebitCreditTransactionForm {
  id?: string;
  /** Type of the resource */
  type?: 'transactions';
  attributes: AccountDebitCreditTransactionFormAttributes;
  relationships?: string;
}

export interface AccountDebitCreditTransactionFormAttributes {
  /** İşlem Tarihi */
  date: string;
  /** İşlem Tutarı */
  amount: number;
  /** İşlem Açıklaması */
  description?: string;
}

export interface Address {
  id?: string;
  /** Type of the resource */
  type?: 'addresses';
  attributes: AddressAttributes;
  relationships?: {
  addressable?: {
  data?: {
  id?: string;
  type?: 'companies';
};
};
};
}

export interface AddressAttributes {
  readonly name?: string;
  readonly address?: string;
  readonly phone?: string;
  readonly fax?: string;
}

export interface BankFee {
  id?: string;
  /** Type of the resource */
  type?: 'bank_fees';
  attributes: BankFeeAttributes;
  relationships?: {
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  tags?: {
  data?: {
  id?: string;
  type?: 'tags';
}[];
};
};
}

export interface BankFeeAttributes {
  readonly total_paid?: number;
  readonly archived?: boolean;
  readonly remaining?: number;
  readonly remaining_in_trl?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  description: string;
  currency: 'TRL' | 'USD' | 'EUR' | 'GBP';
  issue_date: string;
  due_date: string;
  exchange_rate?: number;
  net_total: number;
}

export interface Company {
  id?: string;
  /** Type of the resource */
  type?: 'companies';
  attributes: CompanyAttributes;
  relationships?: {
  default_warehouse?: {
  data?: {
  id?: string;
  type?: 'warehouses';
};
};
  owner?: {
  data?: {
  id?: string;
  type?: 'users';
};
};
  address?: {
  data?: {
  id?: string;
  type?: 'addresses';
};
};
};
}

export interface CompanyAttributes {
  readonly name?: string;
  readonly valid_until?: string;
  readonly subscription_status?: string;
  readonly trial_expiration_at?: string;
  readonly allowed_inspection_at?: string;
  readonly app_url?: string;
  readonly legal_name?: string;
  readonly occupation_field?: string;
  readonly district?: string;
  readonly city?: string;
  readonly tax_office?: string;
  readonly tax_number?: string;
  readonly mersis_no?: string;
  readonly total_unused_bonus_months?: number;
  readonly subscription_started_at?: string;
  readonly subscription_renewed_at?: string;
  readonly subscription_value?: number;
  readonly primary_job?: string;
  readonly is_active?: boolean;
  readonly accessible?: boolean;
  readonly inspectable?: boolean;
  readonly is_in_grace_period?: boolean;
  readonly subscription_status_for_analytics?: string;
  readonly end_of_grace_period_at?: string;
  readonly inventory_enabled?: boolean;
  readonly is_in_trial_period?: boolean;
  readonly has_iyzico_integration?: boolean;
  readonly has_active_subscription?: boolean;
  logo?: string;
  readonly subscription_info_text?: string;
  readonly subscription_info_title?: string;
  readonly subscription_url?: string;
  readonly referral_url?: string;
  readonly subscription_plan_duration?: number;
  readonly subscription_plan_name?: string;
  readonly e_invoicing_activated_at?: string;
  readonly has_selected_plan?: boolean;
}

export interface Contact {
  id?: string;
  /** Type of the resource */
  type?: 'contacts';
  attributes: ContactAttributes;
  relationships?: {
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  contact_portal?: {
  data?: {
  id?: string;
  type?: 'contact_portals';
};
};
  contact_people?: {
  data?: {
  id?: string;
  type?: 'contact_people';
}[];
};
};
}

export interface ContactAttributes {
  /** Bakiye */
  readonly balance?: number;
  /** TL Bakiye */
  readonly trl_balance?: number;
  /** USD Bakiye */
  readonly usd_balance?: number;
  /** EUR Bakiye */
  readonly eur_balance?: number;
  /** GBP Bakiye */
  readonly gbp_balance?: number;
  /** Kayıt tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
  /** E-posta */
  email?: string;
  /** Müşteri/tedarikçi ismi */
  name: string;
  short_name?: string;
  /** Tip */
  contact_type?: 'person' | 'company';
  /** Vergi dairesi */
  tax_office?: string;
  /** Vergi numarası/TC kimlik no */
  tax_number?: string;
  /** İlçe */
  district?: string;
  /** Posta kodu */
  postal_code?: string;
  /** İl */
  city?: string;
  country?: string;
  address?: string;
  phone?: string;
  fax?: string;
  /** Müşteri/tedarikçi yurt dışı bilgisi */
  is_abroad?: boolean;
  archived?: boolean;
  iban?: string;
  account_type: 'customer' | 'supplier';
  /** Listelenmemiş müşteri sonradan listelenebilir hale getirilemez */
  untrackable?: boolean;
  invoicing_preferences?: {
  e_document_accounts?: number[];
};
}

export interface ContactCollectionForm {
  id?: string;
  /** Type of the resource */
  type?: 'transactions';
  attributes: ContactCollectionFormAttributes;
  relationships?: string;
}

export type ContactCollectionFormAttributes = string;

export interface ContactPaymentForm {
  id?: string;
  /** Type of the resource */
  type?: 'transactions';
  attributes: ContactPaymentFormAttributes;
  relationships?: string;
}

export type ContactPaymentFormAttributes = string;

export interface ContactPerson {
  id?: string;
  /** Type of the resource */
  type?: 'contact_people';
  attributes: ContactPersonAttributes;
  relationships?: string;
}

export interface ContactPersonAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface EArchive {
  id?: string;
  /** Type of the resource */
  type?: 'e_archives';
  attributes: EArchiveAttributes;
  relationships?: {
  sales_invoice?: {
  data?: {
  id?: string;
  type?: 'sales_invoices';
};
};
};
}

export interface EArchiveAttributes {
  readonly uuid?: string;
  readonly vkn?: string;
  readonly invoice_number?: string;
  readonly note?: string;
  readonly is_printed?: boolean;
  readonly status?: 'bounced' | 'sent' | 'printed' | 'legalized';
  readonly printed_at?: string;
  readonly cancellable_until?: string;
  readonly is_signed?: boolean;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface EArchiveForm {
  id?: string;
  /** Type of the resource */
  type?: 'e_archives';
  attributes: EArchiveFormAttributes;
  relationships?: string;
}

export type EArchiveFormAttributes = string;

export interface EDocumentCommonForm {
  id?: string;
  /** Type of the resource */
  type?: 'e_document_commons';
  attributes: EDocumentCommonFormAttributes;
  relationships?: string;
}

export interface EDocumentCommonFormAttributes {
  /** Tevkifat kodları - *Tevkifat faturadaki her kalem için ayrıdır. Tevkifat uygulanan her ürün için Tevkifat kodu göndermeniz gerekmektedir.* - *Bu dosyada ilgili kodları bulabilirsiniz: https://ebelge.gib.gov.tr/dosyalar/kilavuzlar/UBLTR_1.2.1_Kilavuzlar.zip* */
  vat_withholding_params?: {
  detail_id?: number;
  vat_withholding_code?: string;
}[];
  /** KDV'si %0 olan hizmet ve ürünlerin KDV muafiyet sebebi kodu. - *Bu dosyada ilgili kodları bulabilirsiniz: https://ebelge.gib.gov.tr/dosyalar/kilavuzlar/UBLTR_1.2.1_Kilavuzlar.zip* */
  vat_exemption_reason_code?: string;
  /** Eğer KDV muafiyet sebebi kodu 250 veya 350 ise KDV muafiyet sebebi açıklaması. */
  vat_exemption_reason?: string;
  /** ÖTV kodları - *Özel tüketim vergisi faturadaki her kalem için ayrıdır. ÖTV uygulanan her ürün için ÖTV kodu göndermeniz gerekmektedir.* */
  excise_duty_codes?: {
  product?: number;
  sales_excise_duty_code?: '57' | '59' | '60' | '61' | '62' | '63' | '9077';
}[];
}

export interface EDocumentPdf {
  id?: string;
  /** Type of the resource */
  type?: 'e_document_pdfs';
  attributes: EDocumentPdfAttributes;
  relationships?: string;
}

export interface EDocumentPdfAttributes {
  readonly url?: string;
  readonly expires_at?: string;
}

export interface EInvoice {
  id?: string;
  /** Type of the resource */
  type?: 'e_invoices';
  attributes: EInvoiceAttributes;
  relationships?: {
  invoice?: {
  data?: {
  id?: string;
  type?: 'sales_invoices' | 'purchase_bills';
};
};
};
}

export interface EInvoiceAttributes {
  readonly external_id?: string;
  readonly uuid?: string;
  readonly env_uuid?: string;
  readonly from_address?: string;
  readonly from_vkn?: string;
  readonly to_address?: string;
  readonly to_vkn?: string;
  readonly direction?: 'inbound' | 'outbound';
  readonly note?: string;
  readonly response_type?: 'accepted' | 'rejected' | 'refunded';
  readonly contact_name?: string;
  readonly scenario?: 'basic' | 'commercial';
  readonly status?: 'waiting' | 'failed' | 'successful';
  /** GTB Referans Numarası */
  readonly gtb_ref_no?: string;
  /** Gümrük Çıkış Beyannamesi Tescil Numarası - *İhracat faturaları için Satış Faturası Show cevabında `active_e_document` altında gözükür.* */
  readonly gtb_registration_no?: string;
  /** Fiili İhracat Tarihi - *İhracat faturaları için Satış Faturası Show cevabında `active_e_document` altında gözükür.* */
  readonly gtb_export_date?: string;
  /** e-İhracat Red Sebebi - *İhracat faturaları için Satış Faturası Show cevabında `active_e_document` altında gözükür.* */
  readonly response_note?: string;
  readonly issue_date?: string;
  readonly is_expired?: boolean;
  readonly is_answerable?: boolean;
  readonly net_total?: number;
  readonly currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  readonly item_type?: 'refund' | 'invoice';
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface EInvoiceForm {
  id?: string;
  /** Type of the resource */
  type?: 'e_invoices';
  attributes: EInvoiceFormAttributes;
  relationships?: string;
}

export type EInvoiceFormAttributes = string;

export interface EInvoiceInbox {
  id?: string;
  /** Type of the resource */
  type?: 'e_invoice_inboxes';
  attributes: EInvoiceInboxAttributes;
  relationships?: string;
}

export interface EInvoiceInboxAttributes {
  readonly vkn?: string;
  readonly e_invoice_address?: string;
  readonly name?: string;
  readonly inbox_type?: string;
  readonly address_registered_at?: string;
  readonly registered_at?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface ESmm {
  id?: string;
  /** Type of the resource */
  type?: 'e_smms';
  attributes: ESmmAttributes;
  relationships?: {
  sales_invoice?: {
  data?: {
  id?: string;
  type?: 'sales_invoices';
};
};
};
}

export interface ESmmAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly printed_at?: string;
  readonly uuid?: string;
  readonly vkn?: string;
  readonly invoice_number?: number;
  readonly is_printed?: boolean;
  readonly pdf_url?: string;
}

export interface ESmmCommonForm {
  id?: string;
  /** Type of the resource */
  type?: 'e_smm_commons';
  attributes: ESmmCommonFormAttributes;
  relationships?: string;
}

export interface ESmmCommonFormAttributes {
  /** Tevkifat oranına ait vergi kodu. - *Bu dosyada ilgili kodları bulabilirsiniz: https://ebelge.gib.gov.tr/dosyalar/kilavuzlar/UBLTR_1.2.1_Kilavuzlar.zip* */
  vat_withholding_code?: string;
  /** Fatura notu */
  note?: string;
}

export interface Employee {
  id?: string;
  /** Type of the resource */
  type?: 'employees';
  attributes: EmployeeAttributes;
  relationships?: {
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  managed_by_user?: {
  data?: {
  id?: string;
  type?: 'users';
};
};
  managed_by_user_role?: {
  data?: {
  id?: string;
  type?: 'user_roles';
};
};
};
}

export interface EmployeeAttributes {
  /** Bakiye */
  readonly balance?: number;
  readonly trl_balance?: number;
  readonly usd_balance?: number;
  readonly eur_balance?: number;
  readonly gbp_balance?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Çalışan adı soyadı */
  name: string;
  email?: string;
  archived?: boolean;
  iban?: string;
}

export interface InventoryLevel {
  id?: string;
  /** Type of the resource */
  type?: 'inventory_levels';
  attributes: InventoryLevelAttributes;
  relationships?: {
  product?: {
  data?: {
  id?: string;
  type?: 'products';
};
};
  warehouse?: {
  data?: {
  id?: string;
  type?: 'warehouses';
};
};
};
}

export interface InventoryLevelAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Stok Miktarı */
  readonly stock_count?: number;
  /** Başlangıç Stok Miktarı */
  initial_stock_count?: number;
  critical_stock_count?: number;
}

export interface ItemCategory {
  id?: string;
  /** Type of the resource */
  type?: 'item_categories';
  attributes: ItemCategoryAttributes;
  relationships?: {
  parent_category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  subcategories?: {
  data?: {
  id?: string;
  type?: 'item_categories';
}[];
};
};
}

export interface ItemCategoryAttributes {
  readonly full_path?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Kategori adı */
  name: string;
  /** Renk */
  bg_color?: string;
  /** Yazı rengi */
  text_color?: string;
  /** Kategori tipi */
  category_type: 'Product' | 'Contact' | 'Employee' | 'SalesInvoice' | 'Expenditure';
  parent_id?: number;
}

export interface Me {
  id?: string;
  /** Type of the resource */
  type?: 'users';
  attributes: MeAttributes;
  relationships?: {
  user_roles?: {
  data?: {
  id?: string;
  type?: 'user_roles';
}[];
};
  companies?: {
  data?: {
  id?: string;
  type?: 'companies';
}[];
};
  profile?: {
  data?: {
  id?: string;
  type?: 'profiles';
};
};
};
}

export interface MeAttributes {
  readonly name?: string;
  readonly email?: string;
  readonly is_confirmed?: boolean;
}

export interface Payment {
  id?: string;
  /** Type of the resource */
  type?: 'payments';
  attributes: PaymentAttributes;
  relationships?: {
  payable?: {
  data?: {
  id?: string;
  type?: 'sales_invoices' | 'purchase_bills' | 'taxes' | 'bank_fees' | 'salaries' | 'checks';
};
};
  transaction?: {
  data?: {
  id?: string;
  type?: 'transactions';
};
};
};
}

export interface PaymentAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Ödeme tarihi */
  date?: string;
  /** Ödeme tutarı */
  amount?: number;
  /** Para birimi */
  currency?: number;
  notes?: string;
}

export interface PaymentForm {
  id?: string;
  /** Type of the resource */
  type?: 'payments';
  attributes: PaymentFormAttributes;
  relationships?: string;
}

export interface PaymentFormAttributes {
  /** Ödeme/Tahsilat Açıklaması */
  description?: string;
  /** Kasa veya Banka - *Bu parametre ayrıca ödemenin/tahsilatın hangi döviz kuru ile yapılacağını belirler.* */
  account_id?: number;
  /** Ödeme/Tahsilat tarihi */
  date?: string;
  /** Ödeme/Tahsilat tutarı */
  amount?: number;
  /** Döviz kuru - *Eğer ödeme/tahsilat, faturadan farklı bir döviz kuru ile yapılacaksa; döviz kurunun TL karşılığını belirtin. Eğer ödeme/tahsilat, fatura ile aynı döviz kuru ile yapılacaksa; "1.0" değerini girin veya boş bırakın.* */
  exchange_rate?: number;
}

export interface Product {
  id?: string;
  /** Type of the resource */
  type?: 'products';
  attributes: ProductAttributes;
  relationships?: {
  inventory_levels?: {
  data?: {
  id?: string;
  type?: 'inventory_levels';
};
};
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
};
}

export interface ProductAttributes {
  readonly sales_excise_duty_code?: string;
  readonly sales_invoice_details_count?: number;
  readonly purchase_invoice_details_count?: number;
  readonly list_price_in_trl?: number;
  readonly buying_price_in_trl?: number;
  /** Stok Miktarı */
  readonly stock_count?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Ürün/hizmet kodu */
  code?: string;
  /** Ürün/hizmet ismi */
  name: string;
  /** KDV oranı */
  vat_rate?: number;
  /** Satış ÖTV */
  sales_excise_duty?: number;
  /** Satış ÖTV tipi */
  sales_excise_duty_type?: string;
  /** Alış ÖTV */
  purchase_excise_duty?: number;
  /** Alış ÖTV tipi */
  purchase_excise_duty_type?: string;
  /** Birim */
  unit?: string;
  /** ÖİV oranı */
  communications_tax_rate?: number;
  archived?: boolean;
  /** Satış fiyatı */
  list_price?: number;
  /** Satış döviz */
  currency?: string;
  /** Alış fiyatı */
  buying_price?: number;
  /** Alış döviz */
  buying_currency?: string;
  inventory_tracking?: boolean;
  /** Başlangıç Stok Miktarı. Birden fazla deponuz varsa başlangıç stok miktarını, depo stok seviyesi (inventory_level) relationship'i üzerinden depo bazında göndermelisiniz. */
  initial_stock_count?: number;
  /** Ürünün GTIP kodu - *https://uygulama.gtb.gov.tr/Tara adresinden öğrenebilirsiniz* */
  gtip?: string;
  barcode?: string;
}

export interface Profile {
  id?: string;
  /** Type of the resource */
  type?: 'profiles';
  attributes: ProfileAttributes;
  relationships?: {
  user?: {
  data?: {
  id?: string;
  type?: 'users';
};
};
};
}

export interface ProfileAttributes {
  readonly phone?: string;
  readonly job_title?: string;
  avatar?: string;
}

export interface PurchaseBill {
  id?: string;
  /** Type of the resource */
  type?: 'purchase_bills';
  attributes: PurchaseBillAttributes;
  relationships?: {
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  spender?: {
  data?: {
  id?: string;
  type?: 'employees';
};
};
  supplier?: {
  data?: {
  id?: string;
  type?: 'contacts';
};
};
  details?: {
  data?: {
  id?: string;
  type?: 'purchase_bill_details';
}[];
};
  payments?: {
  data?: {
  id?: string;
  type?: 'payments';
}[];
};
  tags?: {
  data?: {
  id?: string;
  type?: 'tags';
}[];
};
  recurrence_plan?: {
  data?: {
  id?: string;
  type?: 'recurrence_plans';
};
};
  active_e_document?: {
  data?: {
  id?: string;
  type?: 'e_invoices';
};
};
  pay_to?: {
  data?: {
  id?: string;
  type?: 'contacts' | 'employees';
};
};
};
}

export interface PurchaseBillAttributes {
  readonly archived?: boolean;
  readonly total_paid?: number;
  readonly gross_total?: number;
  readonly total_excise_duty?: number;
  readonly total_communications_tax?: number;
  total_vat: number;
  readonly total_vat_withholding?: number;
  readonly total_discount?: number;
  readonly total_invoice_discount?: number;
  readonly remaining?: number;
  readonly remaining_in_trl?: number;
  readonly payment_status?: 'paid' | 'overdue' | 'unpaid' | 'partially_paid';
  readonly is_detailed?: boolean;
  readonly sharings_count?: number;
  readonly e_invoices_count?: number;
  readonly remaining_reimbursement?: number;
  readonly remaining_reimbursement_in_trl?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  item_type: 'purchase_bill' | 'cancelled' | 'recurring_purchase_bill' | 'refund';
  description?: string;
  issue_date: string;
  due_date: string;
  invoice_no?: string;
  currency: 'TRL' | 'USD' | 'EUR' | 'GBP';
  exchange_rate?: number;
  net_total: number;
  withholding_rate?: number;
  invoice_discount_type?: 'percentage' | 'amount';
  invoice_discount?: number;
}

export interface PurchaseBillBasicForm {
  id?: string;
  /** Type of the resource */
  type?: 'purchase_bills';
  attributes: PurchaseBillBasicFormAttributes;
  relationships?: string;
}

export interface PurchaseBillBasicFormAttributes {
  item_type: 'purchase_bill' | 'refund';
  description?: string;
  issue_date: string;
  due_date: string;
  invoice_no?: string;
  currency: 'TRL' | 'USD' | 'EUR' | 'GBP';
  exchange_rate?: number;
  net_total: number;
  total_vat: number;
}

export interface PurchaseBillDetail {
  id?: string;
  /** Type of the resource */
  type?: 'purchase_bill_details';
  attributes: PurchaseBillDetailAttributes;
  relationships?: {
  warehouse?: {
  data?: {
  id?: string;
  type?: 'warehouses';
};
};
  product?: {
  data?: {
  id?: string;
  type?: 'products';
};
};
};
}

export interface PurchaseBillDetailAttributes {
  readonly net_total?: number;
  readonly vat_withholding?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  vat_withholding_rate?: number;
  discount_type?: 'percentage' | 'amount';
  discount_value?: number;
  excise_duty_type?: 'percentage' | 'amount';
  excise_duty_value?: number;
  communications_tax_rate?: number;
  description?: string;
}

export interface PurchaseBillDetailedForm {
  id?: string;
  /** Type of the resource */
  type?: 'purchase_bills';
  attributes: PurchaseBillDetailedFormAttributes;
  relationships?: string;
}

export interface PurchaseBillDetailedFormAttributes {
  item_type: 'purchase_bill' | 'refund';
  description?: string;
  issue_date: string;
  due_date: string;
  invoice_no?: string;
  currency: 'TRL' | 'USD' | 'EUR' | 'GBP';
  exchange_rate?: number;
  withholding_rate?: number;
  invoice_discount?: number;
  invoice_discount_type?: 'percentage' | 'amount';
}

export interface Salary {
  id?: string;
  /** Type of the resource */
  type?: 'salaries';
  attributes: SalaryAttributes;
  relationships?: {
  employee?: {
  data?: {
  id?: string;
  type?: 'employees';
};
};
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  tags?: {
  data?: {
  id?: string;
  type?: 'tags';
}[];
};
};
}

export interface SalaryAttributes {
  readonly total_paid?: number;
  readonly archived?: boolean;
  readonly remaining?: number;
  readonly remaining_in_trl?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  description: string;
  currency: 'TRL' | 'USD' | 'EUR' | 'GBP';
  issue_date: string;
  due_date: string;
  exchange_rate?: number;
  net_total: number;
}

export interface SalesInvoice {
  id?: string;
  /** Type of the resource */
  type?: 'sales_invoices';
  attributes: SalesInvoiceAttributes;
  relationships?: {
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  contact?: {
  data?: {
  id?: string;
  type?: 'contacts';
};
};
  details?: {
  data?: {
  id?: string;
  type?: 'sales_invoice_details';
}[];
};
  payments?: {
  data?: {
  id?: string;
  type?: 'payments';
}[];
};
  tags?: {
  data?: {
  id?: string;
  type?: 'tags';
}[];
};
  sales_offer?: {
  data?: {
  id?: string;
  type?: 'sales_offers';
};
};
  sharings?: {
  data?: {
  id?: string;
  type?: 'sharings';
}[];
};
  recurrence_plan?: {
  data?: {
  id?: string;
  type?: 'recurrence_plans';
};
};
  active_e_document?: {
  data?: {
  id?: string;
  type?: 'e_archives' | 'e_invoices';
};
};
};
}

export interface SalesInvoiceAttributes {
  readonly archived?: boolean;
  /** Fatura no */
  readonly invoice_no?: string;
  /** Genel Toplam */
  readonly net_total?: number;
  /** Ara toplam */
  readonly gross_total?: number;
  /** Stopaj */
  readonly withholding?: number;
  readonly total_excise_duty?: number;
  readonly total_communications_tax?: number;
  /** Toplam KDV */
  readonly total_vat?: number;
  /** Tevkifat */
  readonly total_vat_withholding?: number;
  /** Toplam indirim */
  readonly total_discount?: number;
  readonly total_invoice_discount?: number;
  /** Vergiler Hariç Toplam */
  readonly before_taxes_total?: number;
  /** Ödenmemiş tutar */
  readonly remaining?: number;
  readonly remaining_in_trl?: number;
  /** Tahsilat durumu */
  readonly payment_status?: 'paid' | 'overdue' | 'unpaid' | 'partially_paid';
  /** Kayıt tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
  /** Fatura türü */
  item_type: 'invoice' | 'export' | 'estimate' | 'cancelled' | 'recurring_invoice' | 'recurring_estimate' | 'recurring_export' | 'refund';
  /** Fatura açıklaması */
  description?: string;
  /** Düzenleme tarihi */
  issue_date: string;
  /** Son tahsilat tarihi */
  due_date?: string;
  /** Fatura seri */
  invoice_series?: string;
  /** Fatura sıra */
  invoice_id?: number;
  /** Döviz tipi */
  currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  /** Döviz kuru */
  exchange_rate?: number;
  /** Stopaj oranı */
  withholding_rate?: number;
  invoice_discount_type?: 'percentage' | 'amount';
  invoice_discount?: number;
  /** Gönderim adresi */
  billing_address?: string;
  /** Gönderim posta kodu */
  billing_postal_code?: string;
  /** Gönderim adresi telefonu */
  billing_phone?: string;
  /** Gönderim adresi faksı */
  billing_fax?: string;
  /** Müşteri vergi dairesi */
  tax_office?: string;
  /** Müşteri vergi numarası */
  tax_number?: string;
  country?: string;
  city?: string;
  district?: string;
  /** Alıcı yurt dışı bilgisi */
  is_abroad?: boolean;
  /** Sipariş no (resmileştirmek için order_date dolu ise bu alan zorunludur) */
  order_no?: string;
  /** Sipariş tarihi (resmileştirmek için order_no dolu ise bu alan zorunludur) */
  order_date?: string;
  shipment_addres?: string;
  /** İrsaliyeli fatura */
  shipment_included?: boolean;
  /** Peşin satış */
  cash_sale?: boolean;
  /** Kamu faturaları için zorunludur. */
  payer_tax_numbers?: string[];
  /** Fatura notu */
  invoice_note?: string;
  /** Müşteri bakiyeniz faturaya eklenecektir. */
  append_contact_balance?: boolean;
  /** Bu alana hesap ID'leri eklenebilir. */
  e_document_accounts?: unknown[];
}

export interface SalesInvoiceCreateUpdate {
  id?: string;
  /** Type of the resource */
  type?: 'sales_invoices';
  attributes: SalesInvoiceCreateUpdateAttributes;
  relationships?: string;
}

export type SalesInvoiceCreateUpdateAttributes = string;

export interface SalesInvoiceDetail {
  id?: string;
  /** Type of the resource */
  type?: 'sales_invoice_details';
  attributes: SalesInvoiceDetailAttributes;
  relationships?: {
  warehouse?: {
  data?: {
  id?: string;
  type?: 'warehouses';
};
};
  product?: {
  data?: {
  id?: string;
  type?: 'products';
};
};
};
}

export interface SalesInvoiceDetailAttributes {
  /** Ürün/hizmet net tutarı */
  readonly net_total?: number;
  /** Tevkifat */
  readonly vat_withholding?: number;
  /** Kayıt tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
  /** Miktar */
  quantity: number;
  /** Birim fiyatı */
  unit_price: number;
  /** KDV oranı */
  vat_rate: number;
  /** Tevkifat oranı */
  vat_withholding_rate?: number;
  /** İndirim türü */
  discount_type?: 'percentage' | 'amount';
  discount_value?: number;
  /** ÖTV tipi */
  excise_duty_type?: 'percentage' | 'amount';
  excise_duty_value?: number;
  /** ÖİV oranı */
  communications_tax_rate?: number;
  /** Açıklama */
  description?: string;
  /** Teslim Şartı */
  delivery_method?: 'CFR' | 'CIF' | 'CIP' | 'CPT' | 'DAF' | 'DAP' | 'DPU' | 'DDP' | 'DDU' | 'DEQ' | 'DES' | 'EXW' | 'FAS' | 'FCA' | 'FOB';
  /** Gönderim Şekli */
  shipping_method?: 'Denizyolu' | 'Demiryolu' | 'Karayolu' | 'Havayolu' | 'Posta' | 'Çok araçlı' | 'Sabit taşıma tesisleri' | 'İç su taşımacılığı';
}

export interface SalesOfferAttributes {
  /** Teklif içeriği */
  content?: string;
  /** Alıcı tipi */
  contact_type?: string;
  readonly sharings_count?: number;
  readonly status?: string;
  /** Gösterim döviz kuru */
  display_exchange_rate_in_pdf?: boolean;
  readonly archived?: boolean;
  /** Genel Toplam */
  readonly net_total?: number;
  /** Ara toplam */
  readonly gross_total?: number;
  /** Stopaj */
  readonly withholding?: number;
  readonly total_excise_duty?: number;
  readonly total_communications_tax?: number;
  readonly total_accommodation_tax?: number;
  /** Toplam KDV */
  readonly total_vat?: number;
  /** Toplam Tevkifat */
  readonly total_vat_withholding?: number;
  /** Tevkifat */
  readonly vat_withholding?: number;
  /** Toplam indirim */
  readonly total_discount?: number;
  readonly total_invoice_discount?: number;
  /** Fatura açıklaması */
  description?: string;
  /** Düzenleme tarihi */
  issue_date: string;
  /** Son tahsilat tarihi */
  due_date?: string;
  /** Döviz tipi */
  currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  /** Döviz kuru */
  exchange_rate?: number;
  /** Stopaj oranı */
  withholding_rate?: number;
  invoice_discount_type?: 'percentage' | 'amount';
  invoice_discount?: number;
  /** Gönderim adresi */
  billing_address?: string;
  /** Gönderim adresi telefonu */
  billing_phone?: string;
  /** Gönderim adresi faksı */
  billing_fax?: string;
  /** Müşteri vergi dairesi */
  tax_office?: string;
  /** Müşteri vergi numarası */
  tax_number?: string;
  city?: string;
  district?: string;
  /** Alıcı yurt dışı bilgisi */
  is_abroad?: boolean;
  /** Sipariş no (resmileştirmek için order_date dolu ise bu alan zorunludur) */
  order_no?: string;
  /** Sipariş tarihi (resmileştirmek için order_no dolu ise bu alan zorunludur) */
  order_date?: string;
}

export interface SalesOffers {
  id?: string;
  /** Type of the resource */
  type?: 'sales_offers';
  attributes: SalesOfferAttributes;
  relationships?: {
  sales_invoice?: {
  data?: {
  id?: string;
  type?: 'sales_invoices';
};
};
  contact?: {
  data?: {
  id?: string;
  type?: 'contacts';
};
};
  details?: {
  data?: {
  id?: string;
  type?: 'sales_offer_details';
}[];
};
  activities?: {
  data?: {
  id?: string;
  type?: 'activities';
}[];
};
  sharings?: {
  data?: {
  id?: string;
  type?: 'sharings';
}[];
};
};
}

export interface SalesOffersCreateUpdateAttributes {
  /** Teklif içeriği */
  content?: string;
  /** Alıcı tipi */
  contact_type?: string;
  readonly sharings_count?: number;
  readonly status?: string;
  /** Gösterim döviz kuru */
  display_exchange_rate_in_pdf?: boolean;
  readonly archived?: boolean;
  /** Genel Toplam */
  readonly net_total?: number;
  /** Ara toplam */
  readonly gross_total?: number;
  /** Stopaj */
  readonly withholding?: number;
  readonly total_excise_duty?: number;
  readonly total_communications_tax?: number;
  readonly total_accommodation_tax?: number;
  /** Toplam KDV */
  readonly total_vat?: number;
  /** Toplam Tevkifat */
  readonly total_vat_withholding?: number;
  /** Toplam indirim */
  readonly total_discount?: number;
  readonly total_invoice_discount?: number;
  /** Fatura açıklaması */
  description?: string;
  /** Düzenleme tarihi */
  issue_date: string;
  /** Son tahsilat tarihi */
  due_date?: string;
  /** Döviz tipi */
  currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  /** Döviz kuru */
  exchange_rate?: number;
  /** Stopaj oranı */
  withholding_rate?: number;
  invoice_discount_type?: 'percentage' | 'amount';
  invoice_discount?: number;
  /** Gönderim adresi */
  billing_address?: string;
  /** Gönderim adresi telefonu */
  billing_phone?: string;
  /** Gönderim adresi faksı */
  billing_fax?: string;
  /** Müşteri vergi dairesi */
  tax_office?: string;
  /** Müşteri vergi numarası */
  tax_number?: string;
  city?: string;
  district?: string;
  /** Alıcı yurt dışı bilgisi */
  is_abroad?: boolean;
  /** Sipariş no */
  order_no?: string;
}

export interface SalesOffersDetailAttributes {
  description?: string;
  net_total?: number;
  unit_price?: number;
  vat_rate?: number;
  quantity?: number;
  discount_type?: string;
  discount_value?: number;
  communications_tax_rate?: number;
  excise_duty_type?: string;
  invoice_discount?: number;
  excise_duty?: number;
  excise_duty_rate?: number;
  discount?: number;
  communications_tax?: number;
  detail_no?: number;
  net_total_without_invoice_discount?: number;
  vat_withholding?: number;
  vat_withholding_rate?: number;
  accommodation_tax_rate?: number;
  accommodation_tax?: number;
  accommodation_tax_exempt?: boolean;
  readonly created_at?: string;
  readonly updated_at?: string;
  excise_duty_value?: number;
}

export interface SalesOffersDetails {
  id?: string;
  /** Type of the resource */
  type?: 'sales_offers_details';
  attributes: SalesOffersDetailAttributes;
  relationships?: {
  product?: {
  data?: {
  id?: string;
  type?: 'products';
};
};
};
}

export interface SalesOffersPdf {
  id?: string;
  /** Type of the resource */
  type?: 'sales_offers_pdfs';
  attributes: SalesOffersPdfAttributes;
  relationships?: string;
}

export interface SalesOffersPdfAttributes {
  readonly url?: string;
  readonly created_at?: string;
  readonly status?: string;
  readonly errors?: string[];
  readonly result?: string;
  readonly statistics?: string;
}

export interface SalesOffersUpdateStatusAttributes {
  /** Teklif durumu */
  status: 'accepted' | 'rejected' | 'waiting';
}

export interface SalesOffersUpdateStatusBody {
  data: {
  id?: string;
  type?: 'sales_offers';
  attributes?: SalesOffersUpdateStatusAttributes;
};
  /** Response ile birlikte geri dönmesini istediğiniz ilişkiler - *Available: activities* */
  include?: string;
}

export interface ShipmentDocument {
  id?: string;
  /** Type of the resource */
  type?: 'shipment_documents';
  attributes: ShipmentDocumentAttributes;
  relationships?: {
  contact?: {
  data?: {
  id?: string;
  type?: 'contacts';
};
};
  tags?: {
  data?: {
  id?: string;
  type?: 'tags';
}[];
};
  stock_movements?: {
  data?: {
  id?: string;
  type?: 'stock_movements';
}[];
};
  invoices?: {
  data?: {
  id?: string;
  type?: 'sales_invoices' | 'purchase_bills';
}[];
};
};
}

export interface ShipmentDocumentAttributes {
  /** Arşivlenme durumu */
  readonly archived?: boolean;
  /** Yazdırmaya özel fatura numarası */
  readonly invoice_no?: string;
  /** Yazdırmaya özel not */
  readonly print_note?: string;
  /** Yazdırılma tarihi */
  readonly printed_at?: string;
  /** Kayıt tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
  /** İrsaliye tipi */
  inflow?: boolean;
  /** İrsaliye açıklaması */
  description?: string;
  /** İl */
  city?: string;
  /** İlçe */
  district?: string;
  /** Adres */
  address?: string;
  /** Düzenleme tarihi */
  issue_date: string;
  /** Fiili sevk tarihi */
  shipment_date?: string;
  /** İrsaliye Numarası */
  procurement_number?: string;
}

export interface StockMovement {
  id?: string;
  /** Type of the resource */
  type?: 'stock_movements';
  attributes: StockMovementAttributes;
  relationships?: {
  warehouse?: {
  data?: {
  id?: string;
  type?: 'warehouses';
};
};
  product?: {
  data?: {
  id?: string;
  type?: 'products';
};
};
  source?: {
  data?: {
  id?: string;
  type?: 'shipment_documents' | 'sales_invoice_details' | 'purchase_bill_details';
};
};
  contact?: {
  data?: {
  id?: string;
  type?: 'contacts';
};
};
};
}

export interface StockMovementAttributes {
  /** Detay sıra no */
  readonly detail_no?: number;
  /** Hareket tarihi */
  readonly date?: string;
  /** Kayıt tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
  /** Miktar */
  quantity: number;
}

export interface StockUpdate {
  id?: string;
  /** Type of the resource */
  type?: 'stock_updates';
  attributes: StockUpdateAttributes;
  relationships?: {
  details?: {
  data?: {
  id?: string;
  type?: 'stock_update_details';
}[];
};
};
}

export interface StockUpdateAttributes {
  /** Stok güncelleme tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
}

export interface StockUpdateDetail {
  id?: string;
  /** Type of the resource */
  type?: 'stock_update_details';
  attributes: StockUpdateDetailAttributes;
  relationships?: {
  warehouse?: {
  data?: {
  id?: string;
  type?: 'warehouses';
};
};
  product?: {
  data?: {
  id?: string;
  type?: 'products';
};
};
};
}

export interface StockUpdateDetailAttributes {
  /** Eski stok miktarı */
  readonly old_total_inventory?: number;
  /** Kayıt tarihi */
  readonly created_at?: string;
  /** Son güncelleme tarihi */
  readonly updated_at?: string;
  /** Yeni stok miktarı */
  new_total_inventory: number;
}

export interface Tag {
  id?: string;
  /** Type of the resource */
  type?: 'tags';
  attributes: TagAttributes;
  relationships?: string;
}

export interface TagAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Etiket adı */
  name: string;
}

export interface Tax {
  id?: string;
  /** Type of the resource */
  type?: 'bank_fees';
  attributes: TaxAttributes;
  relationships?: {
  category?: {
  data?: {
  id?: string;
  type?: 'item_categories';
};
};
  tags?: {
  data?: {
  id?: string;
  type?: 'tags';
}[];
};
};
}

export interface TaxAttributes {
  readonly total_paid?: number;
  readonly archived?: boolean;
  readonly remaining?: number;
  readonly remaining_in_trl?: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  description: string;
  issue_date: string;
  due_date: string;
  net_total: number;
}

export interface TrackableJob {
  id?: string;
  /** Type of the resource */
  type?: 'trackable_jobs';
  attributes: TrackableJobAttributes;
  relationships?: string;
}

export interface TrackableJobAttributes {
  readonly status?: 'running' | 'done' | 'error';
  readonly errors?: string[];
}

export interface Transaction {
  id?: string;
  /** Type of the resource */
  type?: 'transactions';
  attributes: TransactionAttributes;
  relationships?: {
  debit_account?: {
  data?: {
  id?: string;
  type?: 'accounts';
};
};
  credit_account?: {
  data?: {
  id?: string;
  type?: 'accounts';
};
};
  payments?: {
  data?: {
  id?: string;
  type?: 'payments';
}[];
};
};
}

export interface TransactionAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Açıklama */
  description?: string;
  /** İşlem türü */
  transaction_type?: string;
  /** Tarih */
  date?: string;
  /** TRL karşılığı meblağ */
  amount_in_trl?: number;
  /** Borç meblağ */
  debit_amount?: number;
  /** Borç döviz cinsi */
  debit_currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
  /** Alacak meblağ */
  credit_amount?: number;
  /** Alacak döviz cinsi */
  credit_currency?: 'TRL' | 'USD' | 'EUR' | 'GBP';
}

export interface UserRole {
  id?: string;
  /** Type of the resource */
  type?: 'user_roles';
  attributes: UserRoleAttributes;
  relationships?: {
  company?: {
  data?: {
  id?: string;
  type?: 'companies';
};
};
  user?: {
  data?: {
  id?: string;
  type?: 'users';
};
};
  managed_employee?: {
  data?: {
  id?: string;
  type?: 'employees';
};
};
};
}

export interface UserRoleAttributes {
  readonly sales_invoices?: 'rw' | 'ro' | 'na';
  readonly expenditures?: 'rw' | 'ro' | 'na';
  readonly own_expenditures?: 'rw' | 'ro' | 'na';
  readonly employees?: 'rw' | 'ro' | 'na';
  readonly accounts?: 'rw' | 'ro' | 'na';
  readonly settings?: 'rw' | 'ro' | 'na';
}

export interface Warehouse {
  id?: string;
  /** Type of the resource */
  type?: 'warehouses';
  attributes: WarehouseAttributes;
  relationships?: {
  inventory_levels?: {
  data?: {
  id?: string;
  type?: 'inventory_levels';
};
};
};
}

export interface WarehouseAttributes {
  readonly created_at?: string;
  readonly updated_at?: string;
  /** Depo İsmi */
  name: string;
  /** Adres */
  address?: string;
  /** İl */
  city?: string;
  /** İlçe */
  district?: string;
  /** Yurt dışında */
  is_abroad?: boolean;
  /** Arşivlenme durumu */
  archived?: boolean;
}

export interface Webhook {
  id?: string;
  /** Type of the resource */
  type?: 'webhook';
  attributes: WebhookAttributes;
}

export interface WebhookAttributes {
  /** Date the record created */
  readonly created_at?: string;
  /** Date the record updated */
  readonly updated_at?: string;
  /** Firma ID */
  readonly company_id?: number;
  /** Model name to create its webhook */
  model?: 'shipment_document' | 'employee' | 'product' | 'contact' | 'stock_movement' | 'sales_invoice';
  /** Action name to create related webhook */
  action?: 'create' | 'update' | 'delete';
  /** URI to use webhook */
  uri?: string;
}
