import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { from, map, switchMap, take, tap } from 'rxjs';
import { Invoice } from './entities/invoice.entity';
import { FileService } from './file.service';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', (done) => {
    const d = fileService.fetchInvoiceData2().pipe((x) => console.log(x));
    d.subscribe({
      next: (v) => console.log('next'),
      error: (e) => console.log('error', e),
      complete: () => done(),
    });

    /*const arr = [];
    arr.push({ data: 123 });
    arr.push({ data: 444 });
    arr.push({ data: 555 });
    arr.push({ data: 666 });
    arr.push({ data: 777 });
    from(arr).subscribe({
      next: (v) => console.log('next'),
      error: (e) => console.log('error', e),
      complete: () => done(),
    });*/
  });
});
