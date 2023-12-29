import {  HttpClientModule } from '@angular/common/http';
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
import { BannerService } from './services/banner.service';
import { PnlSummaryComponent } from '../report/pnl-summary/pnl-summary.component';
import { PositionCcyComponent } from '../report/position-ccy/position-ccy.component';
import { PnlCcyComponent } from '../report/pnl-ccy/pnl-ccy.component';
import { RisksMetricsComponent } from '../report/risks-metrics/risks-metrics.component';
import { AnalyticsComponent } from '../report/analytics/analytics.component';
import { TradeFormComponent } from '../treasuryapp/tradesflow/trade-form.component';




@NgModule({
  declarations: [
    PageNotFoundComponent,
    CustomformatterPipe,
    FormatNumberPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReportModule,
    ReactiveFormsModule,
    PnlSummaryComponent,
    PositionCcyComponent,
    PnlCcyComponent,
    RisksMetricsComponent,
    AnalyticsComponent,
    TradeFormComponent

  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReportModule,
    PnlSummaryComponent,
    PositionCcyComponent,
    PnlCcyComponent,
    RisksMetricsComponent,
    AnalyticsComponent
  ],
  providers: [
    CurrenciesService,
    ProductService,
    SegmentService,
    DealerService,
    CustomerService,
    DailyRateService,
    BannerService
  ]
})
export class SharedModule { }
