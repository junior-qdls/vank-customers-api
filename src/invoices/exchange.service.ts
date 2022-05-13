import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { catchError, from, Observable, of, tap, switchMap } from 'rxjs';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ExchangeService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  getExchangeRate(fr: string, to: string): Observable<number> {
    const key = `${fr}_${to}`;
    return from(this.cacheManager.get(key)).pipe(
      switchMap((val) => {
        console.log(`getting rate from cache key ${key} value ${val}`);
        if (val) return of(Number(val));

        return this.httpService
          .get(
            `https://v6.exchangerate-api.com/v6/006465e90cb0c684625ff98e/pair/${fr}/${to}`,
            { responseType: 'json' },
          )
          .pipe(
            catchError((e) => {
              console.log('something wrong ocurred', e);
              throw e;
            }),
            switchMap(async (response) => {
              const rate = Number(response.data.conversion_rate);
              await this.cacheManager.set(key, rate, { ttl: 900000 });
              return rate;
            }),
          );
      }),
    );
  }
}
