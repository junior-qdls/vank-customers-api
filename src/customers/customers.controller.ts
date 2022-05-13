import { Controller, Post, Body, Patch, Param, HttpCode } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @HttpCode(201)
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    await this.customersService.create(createCustomerDto);
    return {
      message: 'customer created!',
    };
  }

  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.customersService.update(+id, updateCustomerDto);
  }
}
