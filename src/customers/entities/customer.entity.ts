import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BankRecord } from './bank-records.entity';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'ALWAYS',
  })
  id: number;

  @Column()
  companyName: string;

  @Column()
  internalCode: string;

  @Column()
  tributaryId: string;

  @Column()
  currency: string;

  @Column()
  apiQuotaCalls: number;

  @OneToMany(() => BankRecord, (bankRecord) => bankRecord.customer, {
    cascade: true,
  })
  bankRecords: BankRecord[];
}
