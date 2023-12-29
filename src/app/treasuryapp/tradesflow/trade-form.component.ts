import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/model/currency';
import { Customer } from 'src/app/model/customer';
import { Product } from 'src/app/model/product';
import { DailyRateService } from 'src/app/shared/services/dailyrates.service';
import { TradeComponent } from '../fxblotter/trade.component';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [],
  templateUrl: './trade-form.component.html',
  styleUrl: './trade-form.component.css'
})
export class TradeFormComponent implements OnInit{
 tradeForm!: FormGroup;
 products: Product[] = [];
 filteredProduits: Product[] = [];
 customers: Customer[] = [];
 currencies: Currency[] = [];
 totalSum = 0;
 tradeFormValueChanges$!: Observable<any>;
 myFormCategoryChanges$!: Observable<any>;
 myFormProduitChanges$!: Observable<any>;
 selectedRowData: any;
  color = 'blue';
  disabled = false;
  focused = true;
  private ccy1_rate = 1;
  private ccy2_rate = 1;
  private syst_rate = 1;
  amount1Formatted = 0;
  // private selectedProduit!: Product;
  buySells: any[] = [
    { value: 'buy', viewValue: 'Buy' },
    { value: 'sell', viewValue: 'Sell' },
  ];
  ccyPair: { value: string; viewValue: string }[] = [];

  private currentDate = new Date().toISOString().substring(0, 16);

  constructor(  private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public receiveData: any,
    private dialogRef: MatDialogRef<TradeComponent>,
    private rate_service: DailyRateService) {}
  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
      this.tradeForm = this.fb.group({
      trade_id: [{ value: 'ID- ' + Date.now(), disabled: true }],
      customer: ['', Validators.required],
      product: ['', Validators.required],
      value_date: ['', Validators.required],
      deal_date: ['', Validators.required],
      booking_date: [{ value: this.currentDate, disabled: true }],
      ccy1: ['', Validators.required],
      ccy2: ['', Validators.required],
      ccy_pair: ['', Validators.required],
      buy_sell: ['', Validators.required],
      amount1: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      amount2: [{ value: '', disabled: true }],
      deal_rate: ['', Validators.required],
      fees_rate: [''],
      tx_comments: [''],
      system_rate: [{ value: '', disabled: true }],
      cover_rate: [{ value: '', disabled: true }],
      gross_pnl: [{ value: '', disabled: true }],
      net_pnl: [{ value: '', disabled: true }, Validators.required],
    });
  }

  submitTradeForm() {
    if (this.tradeForm.valid) {
      const newTrade = this.tradeForm.value;

      // Close the dialog and pass the new trade data to the parent component
      this.dialogRef.close(newTrade);
    } else {
      // Handle form validation errors or display a message to the user
    }
  }
}
