export interface InvoicesResultDto {
  invoiceId: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceTotal: string;
  paymentTotal: string;
  creditTotal: number;
  bankId: number;
}
