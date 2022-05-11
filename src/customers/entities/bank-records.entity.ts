import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'bank_record' })
export class BankRecord {
  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'ALWAYS',
  })
  id: number;

  @Column()
  bankRecordNumber: number;

  @ManyToOne((type) => Customer, (customer) => customer.bankRecords)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Customer;
}
