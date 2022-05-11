import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  flatMap,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs';
import * as csv from 'csvtojson';
import { Readable } from 'stream';
import { dir } from 'console';
import { json } from 'stream/consumers';
import { response } from 'express';

type InvoiceType = {
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
};

@Injectable()
export class FileService {
  constructor(private httpService: HttpService) {}
  fetchInvoiceData(): Observable<InvoiceType> {
    return this.httpService
      .get(
        'https://gist.githubusercontent.com/rogelio-meza-t/f70a484ec20b8ea43c67f95a58597c29/raw/41f289c605718e923fc1fad0539530e4d0413a90/invoices.csv',
        { responseType: 'text' },
      )
      .pipe(
        map((response) => response.data),
        switchMap((data) => {
          const obs = new Observable<InvoiceType>((sub) => {
            csv()
              .fromString(data)
              .subscribe(
                (c) => {
                  const invoice: InvoiceType = {
                    invoiceId: c.INVOICE_ID,
                    vendorId: c.VENDOR_ID,
                    invoiceNumber: c.INVOICE_NUMBER,
                    invoiceDate: new Date(c.INVOICE_DATE).toISOString(),
                    invoiceTotal: c.INVOICE_TOTAL,
                    paymentTotal: c.PAYMENT_TOTAL,
                    creditTotal: c.CREDIT_TOTAL,
                    bankId: c.BANK_ID,
                    invoiceDueDate: c.INVOICE_DUE_DATE,
                    paymentDate: c.PAYMENT_DATE,
                    currency: c.CURRENCY,
                  };
                  sub.next(invoice);
                },
                (err) => console.log(`error ${err}`),
                () => sub.complete(),
              );
          });
          return obs;
        }),
      );
  }

  fetchInvoiceData2(): Observable<InvoiceType> {
    return this.httpService
      .get(
        'https://gist.githubusercontent.com/rogelio-meza-t/f70a484ec20b8ea43c67f95a58597c29/raw/41f289c605718e923fc1fad0539530e4d0413a90/invoices.csv',
        { responseType: 'text' },
      )
      .pipe(
        map((response) => response.data),
        switchMap((data) => {
          return from(csv().fromString(data)) as Observable<InvoiceType>;
        }),
      );
  }
}
