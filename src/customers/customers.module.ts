import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { HttpModule } from '@nestjs/axios';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Customer]), InvoicesModule],
  controllers: [CustomersController],
  providers: [CustomersService, ExchangeService],
})
export class CustomersModule {}
