import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'invoice' })
export class Invoice {
  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'ALWAYS',
  })
  id: number;

  @Column()
  invoiceId: string;

  @Column()
  vendorId: string;

  @Column()
  invoiceNumber: string;

  @Column()
  invoiceDate: string;

  @Column()
  invoiceTotal: string;

  @Column()
  paymentTotal: string;

  @Column()
  creditTotal: string;

  @Column()
  bankId: number;

  @Column()
  invoiceDueDate: string;

  @Column()
  paymentDate: string;

  @Column()
  currency: string;
}
