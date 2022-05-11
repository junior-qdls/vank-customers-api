import { IsArray, IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export enum Currency {
  CLP = 'CLP',
  USD = 'USD',
  EUR = 'EUR',
}

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'companyName is required' })
  companyName: string;
  @IsNotEmpty({ message: 'internalCode is required' })
  internalCode: string;
  @IsNotEmpty({ message: 'tributary identifier is required' })
  tributaryId: string;
  @IsEnum(Currency, {
    message: 'invalid currency, only options CLP, USD or EUR',
  })
  currency: Currency;
  @IsNumber(
    { allowNaN: false },
    { message: 'The amount of quota calls is required' },
  )
  @Min(1, { message: 'The amount of quota calls should be greater than 0' })
  apiQuotaCalls: number;
  @IsArray({ message: 'bankRecords is required' })
  bankRecords: number[];
}
