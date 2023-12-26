import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BannerService } from 'src/app/shared/services/banner.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        right: '0',
      })),
      state('out', style({
        right: '-100%',
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class BannerComponent implements OnInit{
  public bannerState = false;

  constructor(private bannerService: BannerService){}

  ngOnInit(){
    this.bannerService.bannerState$.subscribe((state) => {
      console.log('I am getting state');
      this.bannerState = state;
    });
  }


  // toggleBanner() {
  //   this.bannerService.toggleBanner();
  //   console.log('Banner State After Toggle:', this.bannerState);
  // }

  // @HostListener('document:click', ['$event'])
  // clickOutsideBanner(event: Event) {
  //   // Check if the clicked element is outside the banner
  //   const bannerElement = document.querySelector('.banner');
  //   if (bannerElement && !bannerElement.contains(event.target as Node)) {
  //     // this.bannerState = 'out';
  //   }
  // }
}
