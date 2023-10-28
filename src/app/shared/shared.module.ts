import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CurrenciesService } from './services/currencies.service';
import { DealerService } from './services/dealer.service';
import { ProductService } from './services/product.service';
import { SegmentService } from './services/segment.service';
import { CustomerService } from './services/customer.service';
import { CustomformatterPipe } from './custom/customformatter.pipe';
// import { MatInputCommifiedDirective } from './custom/mat-input-commified.directive';
import { DailyRateService } from './services/dailyrates.service';
import { ReportModule } from '../report/report.module';
import { FormatNumberPipe } from './format-number.pipe';
import { NumberFormatDirective } from './NumberFormatDirective';




@NgModule({
  declarations: [
    PageNotFoundComponent,
    CustomformatterPipe,
    // MatInputCommifiedDirective,
    FormatNumberPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReportModule,
    ReactiveFormsModule,

  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    ReportModule
  ],
  providers: [
    HttpClient,
    CurrenciesService,
    ProductService,
    SegmentService,
    DealerService,
    CustomerService,
    DailyRateService,
    // MatInputCommifiedDirective
  ]
})
export class SharedModule { }
