import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { map } from 'rxjs';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('/synchronizations')
  syncInvoices() {
    return this.invoicesService.syncInvoices().pipe(
      map((records) => {
        return { message: `job processed with ${records} records` };
      }),
    );
  }

  @Get('customers/:tributaryId')
  async searchInvoices(
    @Res() response,
    @Param('tributaryId') tributaryId: string,
    @Query('vendor') vendor: string,
    @Query('currency') currency: string,
    @Query('invoice_from_date') invoiceFromDate: string,
    @Query('invoice_to_date') invoiceToDate: string,
  ) {
    try {
      const result = await this.invoicesService.searchInvoices(tributaryId, {
        vendor,
        invoiceFromDate,
        invoiceToDate,
        currency,
      });
      return response.status(HttpStatus.OK).send({
        invoices: result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
  }
}
