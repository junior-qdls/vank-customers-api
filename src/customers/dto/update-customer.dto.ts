import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(
  PickType(CreateCustomerDto, ['tributaryId', 'currency']),
) {}
