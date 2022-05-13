import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CustomersService } from 'src/customers/customers.service';
import { Customer } from 'src/customers/entities/customer.entity';

@Injectable()
export class CustomerCacheService {
  constructor(
    private customerService: CustomersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCustomerData(tributaryId: string) {
    const cachedCustomer: Customer = await this.cacheManager.get(tributaryId);
    console.log(`cachedCustomer ${JSON.stringify(cachedCustomer)}`);
    return cachedCustomer
      ? cachedCustomer
      : this.customerService.findCustomerFullInfo(tributaryId);
  }

  async reduceQuota(tributaryId: string) {
    const customer = await this.getCustomerData(tributaryId);
    customer.apiQuotaCalls -= 1;
    //timespan for 15 minutes
    // there is no information if customer should be locked until some minutes in order to increase the quota calls or reset it
    await this.cacheManager.set(customer.tributaryId, customer, {
      ttl: 900000,
    });
  }
}
