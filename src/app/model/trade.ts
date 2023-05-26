import { Currency } from './currency';
import { Product } from './product';

import { Customer } from './customer';


export enum BuySell {
  Buy,
  Sell
}

export interface Trade {
     tradeId: number;
     customer: Customer;
     product: Product;
     value_date: Date;
     booking_date: Date;
     deal_date: Date;
     system_rate: number;
     cover_rate: number;
     ccy1: Currency;
     ccy2: Currency;
     ccypair: string;
     buysell: BuySell;
     amount1: number ;
     amount2: number;
     dealrate: number;
     feesrate: number;
     gross_pnl: number;
     net_pnl: number;
     tx_comments: string;

  }



