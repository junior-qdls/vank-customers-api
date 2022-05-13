import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Invoice } from './entities/invoice.entity';
import { FileService } from './file.service';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;
  const mockRepository = {
    save: jest.fn().mockImplementation((dto: any) => {
      return { ...dto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: FileService,
          useFactory: () => ({
            fetchInvoiceData: () => {
              return from([
                {
                  invoiceId: '112',
                  vendorId: '37',
                  invoiceNumber: '547481328',
                  invoiceDate: '2014-05-20T05:00:00.000Z',
                  invoiceTotal: '224',
                  paymentTotal: '0',
                  creditTotal: '0',
                  bankId: '3',
                  invoiceDueDate: '25-JUN-14',
                  paymentDate: '',
                  currency: 'EUR',
                },
                {
                  invoiceId: '113',
                  vendorId: '37',
                  invoiceNumber: '547481328',
                  invoiceDate: '2014-05-20T05:00:00.000Z',
                  invoiceTotal: '224',
                  paymentTotal: '0',
                  creditTotal: '0',
                  bankId: '3',
                  invoiceDueDate: '25-JUN-14',
                  paymentDate: '',
                  currency: 'EUR',
                },
                {
                  invoiceId: '114',
                  vendorId: '37',
                  invoiceNumber: '547481328',
                  invoiceDate: '2014-05-20T05:00:00.000Z',
                  invoiceTotal: '224',
                  paymentTotal: '0',
                  creditTotal: '0',
                  bankId: '3',
                  invoiceDueDate: '25-JUN-14',
                  paymentDate: '',
                  currency: 'EUR',
                },
              ]);
            },
          }),
        },
        InvoicesService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('Test fetch invoices', (done) => {
    service.syncInvoices().subscribe({
      complete: done(),
    });

    expect(mockRepository.save).toHaveBeenCalledTimes(3);
  });
});
