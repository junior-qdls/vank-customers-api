import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, Currency } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  const mockRepo = {
    save: jest.fn().mockImplementation((dto: any) => {
      return { ...dto };
    }),
    findOne: jest.fn().mockImplementation((id) => {
      return {
        tributaryId: '123456789-1',
        currency: 'CLP',
      };
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should create customer', async () => {
    const customer1 = new CreateCustomerDto();
    customer1.bankRecords = [1, 2];
    customer1.companyName = 'acme';
    customer1.currency = Currency.CLP;

    await service.create(customer1);
    expect(service).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should update customer', async () => {
    const customer1 = new CreateCustomerDto();
    customer1.tributaryId = '123456789-1';
    customer1.currency = Currency.CLP;
    const idCustomer = 12;

    await service.update(idCustomer, customer1);
    expect(service).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });
});
