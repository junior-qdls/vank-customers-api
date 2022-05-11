import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Get(':id/invoices')
  searchInvoices(
    @Param('id') tributaryId: number,
    @Query('vendor') vendor: string,
    @Query('currency') currency: string,
    @Query('invoice_from_date') invoiceFromDate: string,
    @Query('invoice_to_date') invoiceToDate: string,
  ) {
    return this.customersService.searchInvoices(
      tributaryId,
      vendor,
      invoiceFromDate,
      invoiceToDate,
      currency,
    );
  }
}
