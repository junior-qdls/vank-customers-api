import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Res() response, @Body() createCustomerDto: CreateCustomerDto) {
    try {
      await this.customersService.create(createCustomerDto);
      return response.status(HttpStatus.CREATED).send({
        message: 'customer created!',
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
  }

  @Patch(':tributaryId')
  async update(
    @Res() response,
    @Param('tributaryId') tributaryId: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      await this.customersService.update(tributaryId, updateCustomerDto);
      console.log('was updated');

      return response.status(HttpStatus.ACCEPTED).send({
        message: 'customer updated!',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: error.message,
      });
    }
  }
}
