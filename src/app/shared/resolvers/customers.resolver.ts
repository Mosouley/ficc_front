import { CustomerService } from './../services/customer.service';
import { CurrenciesService } from '../services/currencies.service';
import {Injectable} from '@angular/core';





@Injectable()
export class CustomerResolver  {

  constructor(private cust_service: CustomerService) {
  }

  resolve() {
    // this.cust_service.list().subscribe(x => {
    //   console.log(x);
    // });
    return this.cust_service.list();
  }
}
