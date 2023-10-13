import { DailyRateService } from 'src/app/shared/services/dailyrates.service';
import { MatInputCommifiedDirective } from './../../shared/custom/mat-input-commified.directive';
import { Currency } from './../../model/currency';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { Trade } from 'src/app/model/trade';
import { Customer } from 'src/app/model/customer';
import { thousandsValidator } from 'src/app/shared/custom/validators';
import { DecimalPipe } from '@angular/common';
import { Pnl_Calculation } from 'src/app/shared/custom/trade-functions';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit {
  public tradeForm!: FormGroup;
  public products: Product[] = [];
  public filteredProduits: Product[] = [];
  public customers: Customer[] = [];
  public currencies: Currency[] = [];
  public totalSum = 0;
  public tradeFormValueChanges$!: Observable<any>;
  public myFormCategoryChanges$!: Observable<any>;
  public myFormProduitChanges$!: Observable<any>;
  public selectedRowData: any;
  color = 'blue';
  disabled = false;
  focused = true;
  private ccy1_rate = 1;
  private ccy2_rate = 1;
  private syst_rate = 1;

  // private selectedProduit!: Product;
  buySells: any[] = [
    { value: 'buy', viewValue: 'Buy' },
    { value: 'sell', viewValue: 'Sell' },
  ];
  ccyPair: { value: string; viewValue: string }[] = [];

  private currentDate = new Date().toISOString().substring(0, 16);
  constructor(
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public receiveData: any,
    private dialogRef: MatDialogRef<TradeComponent>,
    private rate_service: DailyRateService,
    private decimalPipe: DecimalPipe, private matDir: MatInputCommifiedDirective
  ) {}

  ngOnInit() {
    this.currencies = this.receiveData['currencies']; //this.receiveData.products;
    this.products = this.receiveData['products']; //this.receiveData.products;
    this.customers = this.receiveData['customers']; //this.receiveData.products;
    // this.selectedRowData = this.receiveData.selectedRow;
    this.initData();

    // Subscribe to value changes for both currency inputs
    this.tradeForm.controls['ccy1'].valueChanges.subscribe(
      this.createCcyPairOptions
    );
    this.tradeForm.controls['ccy2'].valueChanges.subscribe(
      this.createCcyPairOptions
    );

    // calculate amount2 based on value in amount1
    this.tradeForm.controls['amount1'].valueChanges.subscribe((amount) => {
    //   console.log('test and check amount ' + amount);

    //    // access the formatted value of the form control through the directive's value property
    // console.log('Value with commas:', this.matDir.value);
    // // access the unformatted value of the form control through the form control's value property
    // console.log('Value without commas:', this.tradeForm.get('amount1')?.value);

      this.tradeForm.controls['amount2'].setValue(
        amount * this.tradeForm.controls['deal_rate'].value
      );
    });

    // calculate amount2 based on value in amount1
    this.tradeForm.controls['deal_rate'].valueChanges.subscribe((rate) => {
      this.tradeForm.controls['amount2'].setValue(
        rate * this.tradeForm.controls['amount1'].value
      );
    });
    this.tradeForm.controls['ccy1'].valueChanges.subscribe( x => {
      this.get_Ccy_Rate(this.tradeForm.controls['ccy1'].value).then(rate => {
        this.ccy1_rate = rate
      }).catch(error => {
        console.error('Error:', error);
      });
    });
    this.tradeForm.controls['ccy2'].valueChanges.subscribe( x => {

    this.get_Ccy_Rate(this.tradeForm.controls['ccy2'].value).then(rate => {
      this.ccy2_rate = rate

    }).catch(error => {
      console.error('Error:', error);
    });
    });
    this.tradeForm.controls['ccy_pair'].valueChanges.subscribe( x => {
     this.syst_rate = this.ccy1_rate / this.ccy2_rate;
     console.log(this.syst_rate);
     this.tradeForm.controls['system_rate'].setValue(this.syst_rate);
    });

    this.tradeForm.valueChanges.subscribe(v => {
      if (this.can_calculate_pnl() == true) {
        this.calculate_PnL();
      }
  });


  }

  // Initialiase the form group
  initData() {
    this.createForm();
  }
  // create the form if it does not exist
  createForm() {
    const numberPatern = '^[0-9.,]+$';
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
      amount1: ['', [Validators.required, thousandsValidator]],
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

  onAmount1Input(event: Event) {
    const inputValue = this.tradeForm.get('amount1')?.value;
    const inputElement = event.target as HTMLInputElement;
    // const amountValue = inputElement.value.replace(/,/g, '');
    // const formattedValue = this.decimalPipe.transform(amountValue, '1.2-2');
    // this.tradeForm.get('amount1')?.setValue(formattedValue);
    // const numericValue = parseFloat(amountValue);

    if (inputValue != null && !isNaN(inputValue)) {
      const formattedValue = new DecimalPipe('en-US').transform(inputValue, '3.2-2');
      // do something with formattedValue
      this.tradeForm.get('amount1')?.setValue(formattedValue);
    }
  }

  // Define a function that creates the currency pair options
  createCcyPairOptions = () => {
    const ccy1 = this.tradeForm.controls['ccy1'].value;
    const ccy2 = this.tradeForm.controls['ccy2'].value;
    this.ccyPair = [
      { value: 'ccy1/ccy2', viewValue: `${ccy1}/${ccy2}` },
      { value: 'ccy2/ccy1', viewValue: `${ccy2}/${ccy1}` },
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

  onSubmit(): void {
    // Handle form submission here
    this.dialogRef.close(this.tradeForm.value)
  }

  /*
  Function to calculate the PnL on the trade
  */
  calculate_PnL(){




    let ccy1_amount = this.tradeForm.controls['amount1'].value;
    let deal_rate = this.tradeForm.controls['deal_rate'].value;



    // this.tradeForm.controls['ccy2'].setValue(syst_rate)
    const pnl = Pnl_Calculation.calculate_pnl(this.ccy2_rate, ccy1_amount, deal_rate, this.syst_rate)
    console.log(pnl);

  }

  get_Ccy_Rate(ccy: Currency): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.rate_service.get(ccy).subscribe(
        rate => {
          resolve(rate.rateLcy);
        },
        error => {
          console.error('API call error:', error);
          reject(error);
        }
      );
    });
  }


  get_system_rate (ccy1: Currency, ccy2: Currency): number {

    return 1;
  }

  can_calculate_pnl(): boolean {
    if (
      this.tradeForm.controls['ccy2'].valid &&
      this.tradeForm.controls['amount1'].valid &&
      this.tradeForm.controls['deal_rate'].valid
    ) {
      return true
    } else {
      return false;
    }

  }

}


  /*

Now the PnL should just be (Dealrate - systemRate) times Deal amount is Sell is selected and the opposite if by is selected


and finally, if CCY1 and CCY2 are different from KES, then you need to multiply the result by CC1 rate to get the PnL in KES

ie table is sorted by date of entry?

please use this function to calculate the PnL, irrespective of the currency

var_PnL= Ccy2_Amount x CCy2_rate -Ccy1_Amount x Ccy1_rate

Then your  function should be

if var_buy_sell = "Sell2, then PnL_amount = var_Pnl, else PnL_amount = -var_Pnl

please trigger that function for every change in

ccy_pair, Ccy1_rate, ccy_2_rate, Amount CCy1, Amount_Ccy2, buy_sell direction

  */
