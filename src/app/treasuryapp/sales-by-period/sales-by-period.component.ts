import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from 'src/app/layout/logout/logout.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DataModel } from 'src/app/model/data.model';
import { FilterComponent } from 'src/app/report/filter/filter.component';
import { ReportComponent } from 'src/app/report/report-template/report.component';
import { API_URLS } from 'src/app/shared/config/app.url.config';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-sales-by-period',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReportComponent,
    FilterComponent,
     ],
  templateUrl: './sales-by-period.component.html',
  styleUrl: './sales-by-period.component.css'
})
export class SalesByPeriodComponent implements OnInit{
  @ViewChild(FilterComponent) filterComponent!: FilterComponent;

  reportingData!: any[]  ;
  model: DataModel[] = [];
  start = new Date()
  end = new Date()
  reportName = 'FX Blotter  from '
  filteredData : any[]= []

  constructor(private wsService: WebsocketService){}
  ngOnInit(): void {
  this.model = [
    new DataModel('customer', 'Customer', 'Array', false, 'name', 'uppercase'),
    new DataModel('product', 'Product', 'Array', false, 'name', 'uppercase'),
    new DataModel('id', 'TradeId', 'string', false, [], 'uppercase'),
    new DataModel('val_date', 'ValDate', 'date', false, [],'date:shortDate'),
    new DataModel('tx_date', 'TxDate', 'date', false, [],'date:shortDate'),
    new DataModel('ccy1', 'Ccy1', 'Array', false, 'code', 'uppercase'),
    new DataModel('ccy2', 'Ccy2', 'Array', false, 'code', 'uppercase'),
    new DataModel('buy_sell', 'Buy/Sell', 'string', false, []),
    new DataModel('amount1', 'Ccy1_Amount', 'number', true, [],'`number:`1.2-2`'),
    new DataModel('amount2', 'Ccy2_Amount', 'number', false, [],'`number:`1.2-2`'),
    new DataModel('deal_rate', 'DealRate', 'number', false, [],'`number:`1.2-2`'),
    new DataModel('system_rate', 'ReevalRate', 'number', false, [],'`number:`1.2-2`'),
    new DataModel('fees_rate', 'Other Fees', 'number', false, [],'`number:`1.2-2`'),
    new DataModel('deal_pnl', 'PnL000', 'number', false, []),
    new DataModel('trader', 'Dealer', 'Array', false, 'name', 'uppercase'),
    new DataModel('status', 'Status', 'string', false, [],'uppercase'),
    new DataModel('last_updated', 'Last. Up', 'time', false, [],'date:`h:mm a`'),
  ];
  this.setPeriod()

  }

  onReportingPeriodChange(newValue: any): void {
    // Handle changes to yourVariable in real-time
    this.start = newValue.timePeriod.startDay
    this.end = newValue.timePeriod.endDay
    this.setPeriod()

  }

  async fetchData(start: Date , end:  Date ) {
    this.wsService.connect(API_URLS.WEBSOCKETS_TRADEFLOWS).subscribe({
      next: (data: any) => {
        if(data.type==='trade_list'){
          this.reportingData =[...data.data]
          this.filterData(start,end)
        }
       },

      error: (e) => console.error(e),
      complete:() => console.info('completed')
    });
    this.filterData(start,end)
  }
filterData(start: Date , end:  Date ){
  this.filteredData = this.reportingData?.filter((model: any) => {
    const txDate = new Date(model['tx_date'])
    return txDate.setHours(0,0,0,0) >= start.setHours(0,0,0,0) && txDate.setHours(0,0,0,0) <= end.setHours(0,0,0,0)
  }).reverse();
}
 async setPeriod(){
    this.reportName =''
    this.reportName = 'FX Blotter  from '+

    `${formatDate(this.start, 'mediumDate', 'en-US')}` +
    ' To ' +
    `${formatDate(this.end, 'mediumDate', 'en-US')}`;

    // refetch the data
    await this.fetchData(this.start, this.end)
  }

}
