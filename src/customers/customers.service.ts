import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoicesService } from 'src/invoices/invoices.service';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { InvoicesResultDto } from './dto/search-invoice';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BankRecord } from './entities/bank-records.entity';
import { Customer } from './entities/customer.entity';
import { ExchangeService } from './exchange.service';
import { Decimal } from 'decimal.js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private invoiceService: InvoicesService,
    private exchangeService: ExchangeService,
  ) {}

  public async create(createCustomerDto: CreateCustomerDto) {
    return this.customerRepository.save({
      ...createCustomerDto,
      bankRecords: createCustomerDto.bankRecords.map((item) => {
        const bankRecord = new BankRecord();
        bankRecord.bankRecordNumber = item;
        return bankRecord;
      }),
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer: Customer = await this.customerRepository.findOne(id);
    const { currency, tributaryId } = updateCustomerDto;
    if (!customer) throw new Error(`customer ${id} not found`);

    customer.currency = currency ? currency : customer.currency;
    customer.tributaryId = tributaryId ? tributaryId : customer.tributaryId;

    return this.customerRepository.save(customer);
  }

  async searchInvoices(
    tributaryId: number,
    vendor: string,
    invoiceFromDate: string,
    invoiceToDate: string,
    currency?: string,
  ) {
    const customer: Customer = await this.customerRepository.findOne({
      relations: ['bankRecords'],
      where: {
        tributaryId: tributaryId,
      },
    });

    if (!customer) throw new Error(`customer ${tributaryId} not found`);

    const invoices = await this.invoiceService.searchInvoices({
      vendor,
      invoiceToDate,
      invoiceFromDate,
      bankIds: customer.bankRecords.map((br) => br.bankRecordNumber),
    });

    if (invoices.length === 0) return [];

    return this.mapToCustomerInvoices(
      invoices,
      currency ? currency : customer.currency,
    );
  }

  mapToCustomerInvoices(
    invoices: Invoice[],
    currency: string,
  ): InvoicesResultDto[] {
    Decimal.set({ precision: 5, rounding: 4 });
    const exchangeRateMemo: Map<string, number> = new Map();
    return invoices.map((item) => {
      let exchangeRate = 1;
      const key = `${item.currency}_${currency}`;

      if (exchangeRateMemo.has(key)) {
        exchangeRate = exchangeRateMemo.get(key);
      } else {
        if (item.currency !== currency)
          exchangeRate = this.getExchangeRate(item.currency, currency);
        exchangeRateMemo.set(key, exchangeRate);
      }

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
    console.log('getting exchange rate');
    let exchangeRate: number = undefined;
    this.exchangeService.getExchangeRate(from, to).subscribe((data) => {
      exchangeRate = data;
    });
    console.log(` from ${from} , to ${to} , result ${exchangeRate}`);
    return exchangeRate;
  }
}
