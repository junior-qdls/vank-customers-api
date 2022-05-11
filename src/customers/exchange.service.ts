import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  flatMap,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs';
import * as csv from 'csvtojson';
import { Readable } from 'stream';
import { dir } from 'console';
import { json } from 'stream/consumers';
import { response } from 'express';

@Injectable()
export class ExchangeService {
  constructor(private httpService: HttpService) {}
  getExchangeRate(from: string, to: string): Observable<number> {
    return this.httpService
      .get(
        `https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&apiKey=d2a665b4ed59c164d98a`,
        { responseType: 'json' },
      )
      .pipe(map((response) => Number(Object.keys(response.data)[0])));
  }
}
