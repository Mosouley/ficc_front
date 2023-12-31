import { Currency } from './currency';
import { Product } from './product';

import { Customer } from './customer';


export enum BuySell {
  Buy,
  Sell
}

export interface Trade {
     trade_id: number;
     tx_date: Date;
     val_date: Date;
     ccy1: Currency;
     ccy2: Currency;
     buy_sell: BuySell;
     amount1: number ;
     amount2: number;
     deal_rate: number;
     fees_rate: number;
     system_rate: number;
     deal_pnl: number;
     tx_comments: string;
     customer: Customer;
     product: Product;
     trader: string;
  }

  export class Trade {
    constructor(){};

  }



