import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, count, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { CustomerCacheService } from './customers.cache.service';
import { InvoicesResultDto } from './dto/search-invoice';
import { SearchInvoice } from './dto/search-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { ExchangeService } from './exchange.service';
import { FileService } from './file.service';
import { Decimal } from 'decimal.js';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @Inject(FileService)
    private readonly fileService: FileService,
    private exchangeService: ExchangeService,
    private customersCache: CustomerCacheService,
  ) {}

  syncInvoices() {
    return from(
      this.invoiceRepository.findOne({
        order: {
          id: 'DESC',
        },
      }),
    ).pipe(
      switchMap((invoice) => {
        return from(this.fileService.fetchInvoiceData()).pipe(
          map((data) => {
            const { id = 0 } = invoice || {};
            //lets suppose csv data is ordered asc, so I lookup the greatest id in invoice, so that it wont save the same records off csv to db
            if (id < Number(data.invoiceId))
              return from(this.invoiceRepository.save(data));
          }),
        );
      }),
      count((invSaved) => invSaved !== undefined),
    );
  }

  async searchInvoices(tributaryId: string, filter: SearchInvoice) {
    const customer = await this.customersCache.getCustomerData(tributaryId);

    if (customer.apiQuotaCalls <= 0)
      throw new Error('Maximum quota calls exceeded');
    else await this.customersCache.reduceQuota(tributaryId);

    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

    if (filter.bankIds) {
      queryBuilder.andWhere('invoice.bankId IN (:...bankRecords)', {
        bankRecords: customer.bankRecords.map((item) => item.bankRecordNumber),
      });
    }

    if (filter.vendor) {
      queryBuilder.andWhere(`invoice.vendorId = '${filter.vendor}'`);
    }

    if (filter.invoiceFromDate) {
      queryBuilder.andWhere(
        `invoice.invoiceDate >= '${filter.invoiceFromDate}'`,
      );
    }

    if (filter.invoiceToDate) {
      queryBuilder.andWhere(`invoice.invoiceDate <= '${filter.invoiceToDate}'`);
    }

    const invoices = await queryBuilder.getMany();
    if (invoices.length === 0) return [];

    return this.mapToCustomerInvoices(
      invoices,
      filter.currency ? filter.currency : customer.currency,
    );
  }

  mapToCustomerInvoices(
    invoices: Invoice[],
    currency: string,
  ): InvoicesResultDto[] {
    Decimal.set({ precision: 5, rounding: 4 });
    return invoices.map((item) => {
      const exchangeRate = this.getExchangeRate(item.currency, currency);

      console.log(JSON.stringify(item));
      console.log(`exchange rate ${exchangeRate}`);

      return {
        invoiceId: item.invoiceId,
        vendorId: item.vendorId,
        invoiceNumber: item.invoiceNumber,
        invoiceTotal: new Decimal(item.invoiceTotal)
          .times(exchangeRate)
          .toNumber()
          .toString(),
        paymentTotal: new Decimal(item.paymentTotal)
          .times(exchangeRate)
          .toNumber()
          .toString(),
        creditTotal: Number(item.creditTotal),
        bankId: item.bankId,
      };
    });
  }

  getExchangeRate(from: string, to: string) {
    let exchangeRate = 1;
    if (from !== to) return exchangeRate;
    this.exchangeService.getExchangeRate(from, to).subscribe((data) => {
      exchangeRate = data;
    });
    return exchangeRate;
  }
}
