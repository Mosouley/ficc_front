import { CashBalance } from './../shared/model/cashBalance';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from '../services/data.service';
import { API_URLS } from '../config/app.url.config';


@Injectable()
export class HistoricCashBalanceService {

  private _cashBal = new BehaviorSubject<CashBalance[]>([]);
  private dataStore: { cashBal: CashBalance[] } = { cashBal: [] }; // pour stocker les donnees meme hors ligne
  readonly cashBal = this._cashBal.asObservable();
  private baseUrl = API_URLS.CASHBALANCE_URL;
  constructor(private _http: HttpClient) {
    // super(API_URLS.CASHBALANCE_URL, _http);
  }

  getAll() {

    this._http.get<CashBalance[]>(`${this.baseUrl}`).subscribe(
      data => {
        this.dataStore.cashBal = data;
        this._cashBal.next(Object.assign({}, this.dataStore).cashBal);
        // console.log(this.dataStore);

      },
      error => console.log('Could not load data.')
    );
  }
  load(id: number | string) {
    this._http.get<CashBalance>(`${this.baseUrl}/${id}`).subscribe(
      data => {
        let notFound = true;

        this.dataStore.cashBal.forEach((item, index) => {
          if (item.id === data.id) {
            this.dataStore.cashBal[index] = data;
            notFound = false;
          }
        });

        if (notFound) {
          this.dataStore.cashBal.push(data);
        }

        this._cashBal.next(Object.assign({}, this.dataStore).cashBal);
      },
      error => console.log('Could not load that data.')
    );
  }

  create(cashBal: CashBalance) {
    console.log(cashBal);

    this._http
      .post<CashBalance>(`${this.baseUrl}`, cashBal)
      .subscribe(
        data => {
          this.dataStore.cashBal.push(data);
          this._cashBal.next(Object.assign({}, this.dataStore).cashBal);
        },
        error => console.log('Could not create Cash Balance.')
      );
  }
  update(cash: CashBalance) {
    this._http
      .put<CashBalance>(`${this.baseUrl}`, cash)
      .subscribe(
        data => {
          this.dataStore.cashBal.forEach((t, i) => {
            if (t.id === data.id) {
              this.dataStore.cashBal[i] = data;
            }
          });

          this._cashBal.next(Object.assign({}, this.dataStore).cashBal);
        },
        error => console.log('Could not update cash.')
      );
  }
  remove(cashId) {
    this._http.delete(`${this.baseUrl}/${cashId}`).subscribe(
      response => {
        this.dataStore.cashBal.forEach((t, i) => {
          if (t.id === cashId) {
            this.dataStore.cashBal.splice(i, 1);
          }
        });

        this._cashBal.next(Object.assign({}, this.dataStore).cashBal);
      },
      error => console.log('Could not delete cash.')
    );
  }
}
