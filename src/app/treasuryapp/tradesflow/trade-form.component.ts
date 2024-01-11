import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/model/currency';
import { Customer } from 'src/app/model/customer';
import { Product } from 'src/app/model/product';
import { DailyRateService } from 'src/app/shared/services/dailyrates.service';
import { TradeComponent } from '../fxblotter/trade.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DailyRate } from 'src/app/model/daily_rate';
import { CurrenciesService } from 'src/app/shared/services/currencies.service';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Pnl_Calculation } from 'src/app/shared/custom/trade-functions';
import { TradeService } from 'src/app/shared/services/trade.service';
import { Trade } from 'src/app/model/trade';
import { DealerService } from 'src/app/shared/services/dealer.service';
import { Dealer } from 'src/app/model/dealer';
import { LogoutComponent } from 'src/app/layout/logout/logout.component';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule,NgxCurrencyDirective],
  templateUrl: './trade-form.component.html',
  styleUrl: './trade-form.component.css',
})
export class TradeFormComponent implements OnInit {
  tradeForm!: FormGroup;
  products: Product[] = [];
  filteredProduits: Product[] = [];
  customers: Customer[] = [];
  selectedCustomer!: Customer;
  selectedProduct!: Product;
  currencies: Currency[] = [];
  up_currencies: Currency[] = [];
  totalSum = 0;
  tradeFormValueChanges$!: Observable<any>;
  myFormProduitChanges$!: Observable<any>;
  selectedRowData: any;
  dealer!: Dealer;
  disabled = false;
  focused = true;
  private ccy_rate = 1;
  private ccy2_rate = 1;
  private ccy1_rate = 1;
  private syst_rate = 1;
  amount1Formatted = 0;

  buySells: any[] = [
    { value: 'buy', viewValue: 'Buy' },
    { value: 'sell', viewValue: 'Sell' },
  ];
  ccyPair: { value: number; viewValue: string }[] = [];

  currentDate = new Date().toISOString().substring(0, 16);

  constructor(
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public receiveData: any,
    private dialogRef: MatDialogRef<TradeComponent>,
    private rate_service: DailyRateService,
    private currencyPipe: CurrencyPipe,
    private tradeServ: TradeService,
    private dealerServ: DealerService
  ) {}
  ngOnInit() {
    this.currencies = this.receiveData['currencies']; //
    // console.info(this.receiveData.currencies);
    this.products = this.receiveData['products'];
    this.customers = this.receiveData['customers'];

    this.initializeForm();
    // Subscribe to value changes for both currency inputs
    this.tradeForm.controls['ccy1'].valueChanges.subscribe(
      this.createCcyPairOptions
    );
    this.tradeForm.controls['ccy1'].valueChanges.subscribe((ccy) =>
      this.retrieve_Ccy_Rate(ccy)
        .then((rate) => {
          this.ccy1_rate = rate;
          this.updateCurrenciesList();
        })
        .catch((error) => {
          console.error('Error retrieving rate:', error);
        })
    );
    this.tradeForm.controls['ccy2'].valueChanges.subscribe((ccy) =>
      this.retrieve_Ccy_Rate(ccy)
        .then((rate) => {
          this.ccy2_rate = rate;
        })
        .catch((error) => {
          console.error('Error retrieving rate:', error);
        })
    );

    this.tradeForm.controls['ccy2'].valueChanges.subscribe(
      this.createCcyPairOptions
    );

    // calculate amount2 based on value in amount1
    this.tradeForm.controls['amount1'].valueChanges.subscribe((amount) => {
      this.tradeForm.controls['amount2'].setValue(
        parseFloat(amount) * this.tradeForm.controls['deal_rate'].value
      );
    });
    this.tradeForm.controls['customer'].valueChanges.subscribe((customer) => {
      this.selectedCustomer = this.customers.find((elm) => elm.name === customer.name) as Customer;
    });
    this.tradeForm.controls['product'].valueChanges.subscribe((product) => {
      if (product) {
        this.selectedProduct = this.products.find((elm) => elm.name === product.name) as Product;
      }
    });

    // calculate amount2 based on value in amount1
    this.tradeForm.controls['deal_rate'].valueChanges.subscribe((rate) => {
     const amount2 = rate * parseFloat(this.tradeForm.controls['amount1'].value)
      this.tradeForm.controls['amount2'].patchValue(
        Number(amount2.toFixed(4))
      );
    });

    this.tradeForm.controls['ccy_pair'].valueChanges.subscribe((x) => {
      this.get_system_rate(this.tradeForm.controls['ccy_pair'].value);
    });

    this.dealerServ.get(1).subscribe((dealer) => {
      this.dealer = dealer;
    });


  }

  // Function to update the currencies list for ccy2 based on the selected ccy1 value
  updateCurrenciesList() {
    const selectedCcy1 = this.tradeForm.controls['ccy1'].value;
    this.up_currencies = [...this.currencies];
    this.up_currencies.splice(selectedCcy1, 1);

  }
  createCcyPairOptions = () => {
    const ccy1 = this.tradeForm.controls['ccy1'].value['code'];
    const ccy2 = this.tradeForm.controls['ccy2'].value['code'];
    this.ccyPair = [
      { value: 1, viewValue: `${ccy1}/${ccy2}` },
      { value: 2, viewValue: `${ccy2}/${ccy1}` },
    ];
  };
  // Function that generates a trade id from a the date
  /* Date */
  date(e: any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.tradeForm.get('value_date')!.setValue(convertDate, {
      onlyself: true,
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  get_Ccy_Rate(ccy: Currency): number {
    this.rate_service.get(ccy).subscribe((rate) => {
      this.ccy_rate = rate;
    });
    return this.ccy_rate;
  }

  retrieve_Ccy_Rate(ccy: Currency): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.rate_service.get(ccy.code).subscribe(
        (rate) => {
          resolve(rate.rateLcy);
        },
        (error) => {
          console.error('API call error:', error);
          reject(error);
        }
      );
    });
  }

  get_system_rate(int: number): number {
    if (int === 1) {
      this.syst_rate = this.ccy1_rate / this.ccy2_rate;
    } else {
      this.syst_rate = this.ccy2_rate / this.ccy1_rate;
    }
    this.tradeForm.controls['system_rate'].setValue(this.syst_rate);
    return this.syst_rate;
  }

  initializeForm() {
    this.tradeForm = this.fb.group({
      trade_id: [{ value: 'Trade Id - ' + Date.now(), disabled: true }],
      customer: ['', Validators.required],
      product: ['', Validators.required],
      val_date: ['', Validators.required],
      tx_date: ['', Validators.required],
      ccy1: ['', Validators.required],
      ccy2: ['', Validators.required],
      ccy_pair: ['', Validators.required],
      buy_sell: ['', Validators.required],
      amount1: ['', [Validators.required]],
      amount2: [ '',Validators.required],
      deal_rate: ['', Validators.required],
      fees_rate: [0],
      tx_comments: [''],
      system_rate: [ '', Validators.required],
      deal_pnl: [ '']
    });
  }

  submitTradeForm() {
    if (this.tradeForm.valid) {

      let traded_amount = this.tradeForm.controls['amount1'].value;
      let deal_rate = this.tradeForm.controls['deal_rate'].value;
      const pnl = Pnl_Calculation.calculate_pnl( traded_amount, deal_rate, this.syst_rate,this.ccy2_rate)
      this.tradeForm.controls['deal_pnl'].patchValue(pnl);
     let  newTrade = {
        tx_date: this.tradeForm.controls['tx_date'].value,
        val_date: this.tradeForm.controls['val_date'].value,
        ccy1: this.tradeForm.controls['ccy1'].value,
        ccy2: this.tradeForm.controls['ccy2'].value,
        buy_sell: this.tradeForm.controls['buy_sell'].value,
        amount1: this.tradeForm.controls['amount1'].value,
        amount2: this.tradeForm.controls['amount2'].value,
        deal_rate: this.tradeForm.controls['deal_rate'].value,
        fees_rate: this.tradeForm.controls['fees_rate'].value,
        system_rate: Number(this.tradeForm.controls['system_rate'].value.toFixed(4)),

        deal_pnl: this.tradeForm.controls['deal_pnl'].value,

        tx_comments: this.tradeForm.controls['tx_comments'].value,

        customer: this.selectedCustomer,

        product: this.selectedProduct,

        trader: this.dealer

      };


      this.tradeServ.add(newTrade).subscribe({
        next: data => console.log('Success:', data),
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      }
      );

      // Close the dialog and pass the new trade data to the parent component
      this.dialogRef.close(newTrade);
    } else {
      // Handle form validation errors or display a message to the user
    }
  }

  validateField(fieldName: string): void {
    const control = this.tradeForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  shouldShowError(fieldName: string): boolean | null {
    const control = this.tradeForm.get(fieldName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  displayCustomer(customer: any): string {
    return customer ? customer.name : '';
  }

  /*Function to calculate the PnL on the trade
  */
  // calculate_PnL(){

  //   let traded_amount = this.tradeForm.controls['amount1'].value;
  //   let deal_rate = this.tradeForm.controls['deal_rate'].value;

  //   // this.tradeForm.controls['ccy2'].setValue(syst_rate)
  //   const pnl = Pnl_Calculation.calculate_pnl(this.ccy2_rate, traded_amount, deal_rate, this.syst_rate)
  //   console.log(pnl);

  // }

}

// onSubmit() {
//   const o: any = {};
//   Object.assign(o, this.intakeForm.value);
//   this.formToolsService.traverseTree(o);
//   console.log(o);

// }
/*

Now the PnL should just be (Dealrate - systemRate) times Deal amount is Sell is selected and the opposite if by is selected


and finally, if CCY1 and CCY2 are different from KES, then you need to multiply the result by CC1 rate to get the PnL in KES

ie table is sorted by date of entry?

please use this function to calculate the PnL, irrespective of the currency

var_PnL= Ccy2_Amount x CCy2_rate -traded_amount x Ccy1_rate

Then your  function should be

if var_buy_sell = "Sell2, then PnL_amount = var_Pnl, else PnL_amount = -var_Pnl

please trigger that function for every change in

ccy_pair, Ccy1_rate, ccy_2_rate, Amount CCy1, Amount_Ccy2, buy_sell direction

  */
