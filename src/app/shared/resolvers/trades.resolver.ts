import {Injectable} from '@angular/core';
import { TradeService } from '../services/trade.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Trade } from 'src/app/model/trade';


@Injectable()
export class TradesResolver  {

  constructor(private trades_service: TradeService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Trade[]> {
      // Get the 'pageSize' parameter from the route or set a default value
      const pageSize = route.queryParams['pageSize'] || 5;

    return this.trades_service.list(pageSize);
  }
}
