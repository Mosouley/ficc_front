import { ReactiveFormsModule } from '@angular/forms';
import { TreasuryappRoutingModule } from './treasuryapp-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FxblotterComponent } from './fxblotter/fxblotter.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { FxflowsComponent } from './fxflows/fxflows.component';
import { WalletsizingComponent } from './walletsizing/walletsizing.component';
import { TradeComponent } from './fxblotter/trade.component';
import { SettingsComponent } from './config/settings/settings.component';
import { DataTableComponent } from './config/data-table/data-table.component';
import { ImportFileComponent } from './config/import-file.component';
import { FormatNumberPipe } from '../shared/format-number.pipe';
import { NumberFormatDirective } from '../shared/NumberFormatDirective';
import { TradesflowComponent } from './tradesflow/tradesflow.component';



@NgModule({
  declarations: [
    FxblotterComponent,
    FxflowsComponent,
    WalletsizingComponent,
    TradeComponent,
    SettingsComponent,
    DataTableComponent,
    ImportFileComponent,
    NumberFormatDirective,
    TradesflowComponent


  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TreasuryappRoutingModule,
    MaterialModule,

    SharedModule,
  ],
  providers: [DecimalPipe, FormatNumberPipe,CurrencyPipe]
})
export class TreasuryappModule { }
