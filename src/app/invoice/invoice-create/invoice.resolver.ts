import {Injectable} from '@angular/core';

import {Resolve} from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';




@Injectable()
export class InvoiceResolver implements Resolve<any> {

  constructor(private invoiceService: InvoiceService) {
  }

  resolve() {
    return this.invoiceService.getAll();
  }
}
