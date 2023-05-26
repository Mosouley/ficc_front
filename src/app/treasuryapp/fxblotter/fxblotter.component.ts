import { TradeComponent } from './trade.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from 'src/app/model/currency';
import { Customer } from 'src/app/model/customer';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-fxblotter',
  templateUrl: './fxblotter.component.html'
})
export class FxblotterComponent implements OnInit{
  private customers: Customer[] = [];
  private currencies: Currency[] = [];
  private products: Product[] = [];
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {}

  tradeCapture() {

    let dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig = {
      height: '500px',
      width: '800px',
      data:  {
        currencies: this.route.snapshot.data['currencies'],
        products: this.route.snapshot.data['products'],
        customers: this.route.snapshot.data['customers'],
      }};
    //  dialogConfig.autoFocus = true;
     let dialogRef = this.dialog.open(TradeComponent, dialogConfig);

     dialogRef.afterClosed().subscribe( result => {

      this.router.navigate(['.'], {relativeTo: this.route})
     });
  }
}
