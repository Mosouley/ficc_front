import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  numCards = Array.from(Array(10).keys());

  isSidebarOpen = true;
  isSettingsPanelOpen = false;
  // isSearchBoxOpen = false;
  isSidebarReduced = false;

  @Output () toggleSideNav: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
   }


  ngOnInit(): void {}
  toggleSidebarMenu($event: any) {
    this.isSidebarOpen = $event;
  }

  toggleSidebarReduce($event: any) {
    this.isSidebarReduced = $event;
  }
  toggleSettingsMenu($event: any) {
    this.isSettingsPanelOpen = $event;
  }


}
