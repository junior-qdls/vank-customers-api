export interface CollectInvoiceDto {
  invoiceId: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceTotal: string;
  paymentTotal: string;
  creditTotal: string;
  bankId: number;
  invoiceDueDate: string;
  paymentDate: string;
  currency: string;
}
