export interface SearchInvoice {
  vendor?: string;
  invoiceFromDate?: string;
  invoiceToDate?: string;
  currency?: string;
  bankIds?: number[];
}
