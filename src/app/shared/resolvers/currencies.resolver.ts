import { CurrenciesService } from './../services/currencies.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrenciesResolver  {
  constructor(private curr_service: CurrenciesService) {}

  resolve( ) {
    return this.curr_service.listAll();
      }
  }

