import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private bannerStateSubject = new BehaviorSubject<boolean>(false);
  bannerState$ = this.bannerStateSubject.asObservable();

  toggleBanner() {
    this.bannerStateSubject.next(!this.bannerStateSubject.value);
    console.log('I am toggling banner');

    console.log(this.bannerStateSubject.value);

  }
}
