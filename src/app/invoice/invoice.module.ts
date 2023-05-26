import { InvoiceModalService } from './invoice-modal.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';

import { InvoiceService } from '../services/invoice.service';
import { TransactionLineService } from '../services/transactionLine.service';

import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { InvoiceGenerateComponent } from './invoice-generate/invoice-generate.component';
import { MaterialModule } from '../material/material.module';
@NgModule({
  declarations: [InvoiceCreateComponent,
    InvoiceListComponent,
    InvoiceItemComponent,
    InvoiceGenerateComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

  ],
  exports: [
    MaterialModule
  ],
  // exports: [InvoiceListComponent],
  providers: [InvoiceService, TransactionLineService, DatePipe, InvoiceModalService]
})
export class InvoiceModule {

}
