import {Injectable} from '@angular/core';
import { TradeService } from '../services/trade.service';





@Injectable()
export class TradesResolver  {

  constructor(private trades_service: TradeService) {
  }

  resolve() {
    return this.trades_service.list();
  }
}
