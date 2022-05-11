import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { map, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { SearchInvoice } from './dto/search-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { FileService } from './file.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @Inject(FileService)
    private readonly fileService: FileService,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  findAll() {
    return `This action returns all invoices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }

  syncInvoices() {
    return this.fileService.fetchInvoiceData().pipe(
      tap((invoiceObj) => {
        this.invoiceRepository.save(invoiceObj);
      }),
    );
  }

  searchInvoices(filter: SearchInvoice) {
    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

    if (filter.bankIds) {
      queryBuilder.andWhere('invoice.bankId IN (:...bankRecords)', {
        bankRecords: filter.bankIds,
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

    return queryBuilder.getMany();
  }
}
