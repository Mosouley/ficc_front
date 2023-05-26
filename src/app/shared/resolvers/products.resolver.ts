import { CurrenciesService } from '../services/currencies.service';
import {Injectable} from '@angular/core';

import {Resolve} from '@angular/router';
import { ProductService } from '../services/product.service';



@Injectable()
export class ProductsResolver implements Resolve<any> {

  constructor(private prod_service: ProductService) {
  }

  resolve() {
    // this.prod_service.list().subscribe(x => {
    //   console.log(x);
    // });
    return this.prod_service.list();
  }
}
