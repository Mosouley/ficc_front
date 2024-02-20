import { WebsocketService } from './../../shared/services/websocket.service';
import { Trade } from './../../model/trade';
import { Component, NgZone, OnInit } from '@angular/core';
import { TradeFormComponent } from './trade-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from 'src/app/model/currency';
import { Customer } from 'src/app/model/customer';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-tradesflow',
  templateUrl: './tradesflow.component.html',
  styleUrls: ['./tradesflow.component.css'],
})
export class TradesflowComponent implements OnInit {
  trades: Trade[] = []; // to hold the list of trades

  title = 'app';
  URL = 'ws://localhost:8000/ws/api/fx/trade_update/';

  private customers: Customer[] = [];
  private currencies: Currency[] = [];
  private products: Product[] = [];
  private eventSource!: EventSource;
  messages: any[] = [];
  showNumber = 10;
  selectedPageSize: number = 5; // Default selected page size
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private wsService: WebsocketService,
    private zone: NgZone
  ) { }

  ngOnInit() {

    this.wsService.connect(this.URL).subscribe({
      next: (data: any) => {
        if(data['trade_list']){
          this.trades = [...data['trade_list']].reverse()
        }else if (data['trade_updated']) {
          this.trades.push(data['trade_updated'])
          this.trades.reverse()
        } else {
          console.log('Other data', data);
        }
       },

      error: (e) => console.error(e),
      complete:() => console.info('completed')
    })
  }

  tradeCapture() {
    let dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig = {
      maxWidth: '800px',
      data: {
        currencies: this.route.snapshot.data['currencies'],
        products: this.route.snapshot.data['products'],
        customers: this.route.snapshot.data['customers'],
      },
    };
    //  dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(TradeFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['.'], { relativeTo: this.route });
    });
  }

}
