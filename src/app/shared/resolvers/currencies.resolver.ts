import { CurrenciesService } from './../services/currencies.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrenciesResolver  {
  constructor(private curr_service: CurrenciesService) {}

  resolve( ) {
    return this.curr_service.list();

    //  return forkJoin(
    //   this.curr_service.list(),
    //   this.curr_service.get(1)
    //   .pipe(map(data => {
    //     console.log('data1', data[0]);
    //     console.log('data2', data[1]);
    //     return {maListe: data[0], maSeconde: data[1]}

    //   })))
      }
  }

