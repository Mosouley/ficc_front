import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { DataService } from './data.service';
import { API_URLS } from '../config/app.url.config';


@Injectable()
export class CurrenciesService extends DataService {

  constructor( _http: HttpClient) {
    super(API_URLS.CURRENCIES_URL, _http);
  }
}
