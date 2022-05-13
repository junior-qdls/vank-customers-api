import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BankRecord } from './entities/bank-records.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  public async create(createCustomerDto: CreateCustomerDto) {
    return this.customerRepository.save({
      ...createCustomerDto,
      bankRecords: createCustomerDto.bankRecords.map((item) => {
        const bankRecord = new BankRecord();
        bankRecord.bankRecordNumber = item;
        return bankRecord;
      }),
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer: Customer = await this.customerRepository.findOne(id);
    const { currency, tributaryId } = updateCustomerDto;
    if (!customer) throw new Error(`customer ${id} not found`);

    customer.currency = currency ? currency : customer.currency;
    customer.tributaryId = tributaryId ? tributaryId : customer.tributaryId;

    return this.customerRepository.save(customer);
  }

  async findCustomer(tributaryId: string) {
    const customer: Customer = await this.customerRepository.findOne({
      relations: ['bankRecords'],
      where: {
        tributaryId: tributaryId,
      },
    });

    if (!customer) throw new Error(`customer ${tributaryId} not found`);

    return customer;
  }
}
