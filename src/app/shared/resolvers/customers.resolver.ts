import { CustomerService } from './../services/customer.service';
import { CurrenciesService } from '../services/currencies.service';
import {Injectable} from '@angular/core';

import {Resolve} from '@angular/router';



@Injectable()
export class CustomerResolver implements Resolve<any> {

  constructor(private cust_service: CustomerService) {
  }

  resolve() {
    // this.cust_service.list().subscribe(x => {
    //   console.log(x);
    // });
    return this.cust_service.list();
  }
}
