import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { DataService } from '../services/data.service';
import { API_URLS } from '../config/app.url.config';


@Injectable()
export class TransactionLineService extends DataService {

  constructor( private _http: HttpClient) {
    super(API_URLS.TRANSALINE_URL, _http);
  }

}
