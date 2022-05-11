import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FileService } from './file.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoicesController],
  providers: [FileService, InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
