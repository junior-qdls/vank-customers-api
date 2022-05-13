import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FileService } from './file.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { CustomersModule } from 'src/customers/customers.module';
import { ExchangeService } from './exchange.service';
import { CustomerCacheService } from './customers.cache.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Invoice]), CustomersModule],
  controllers: [InvoicesController],
  providers: [
    FileService,
    InvoicesService,
    ExchangeService,
    CustomerCacheService,
  ],
})
export class InvoicesModule {}
