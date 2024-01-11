import { Trade } from './../../model/trade';
import { Component, OnInit } from '@angular/core';
import { TradeFormComponent } from './trade-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from 'src/app/model/currency';
import { Customer } from 'src/app/model/customer';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-tradesflow',
  templateUrl: './tradesflow.component.html',
  styleUrls: ['./tradesflow.component.css']
})
export class TradesflowComponent implements OnInit{
  trades: Trade[] = []; // to hold the list of trades
  ngOnInit(){
    this.trades = this.route.snapshot.data['trades']

  }

  private customers: Customer[] = [];
  private currencies: Currency[] = [];
  private products: Product[] = [];
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ){}
  tradeCapture() {

    let dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig = {
      // height: '500px',
      // width: '800px',
      data:  {
        currencies: this.route.snapshot.data['currencies'],
        products: this.route.snapshot.data['products'],
        customers: this.route.snapshot.data['customers']
      }};
    //  dialogConfig.autoFocus = true;
     let dialogRef = this.dialog.open(TradeFormComponent, dialogConfig);

     dialogRef.afterClosed().subscribe( result => {
      console.log(result);


      this.router.navigate(['.'], {relativeTo: this.route})
     });
  }

  openTradeDialog() {
    const dialogRef = this.dialog.open(TradeFormComponent, {
      width: '400px', // Set the width as needed
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        // Add the new trade to the existing trades
        console.log(data);

        // this.trades.unshift(this.newTrade);
      }
    });
}

}
