import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RouterModule } from '@angular/router';
import { childRoutes } from 'src/app/layout/child-routes';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuNode } from 'src/app/shared/menu-node';


@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, MaterialModule,
    RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {

 // creating input and output variable for sidebar reduction
 @Input() isSidebarReduced = true;
 @Output () toggleSidebarReduce: EventEmitter<boolean> = new EventEmitter<boolean>();

 // creating input variable to toglle sidebar close/open
 @Input() isSidebarOpen = false;

 // links: MenuNode[] = [
 //   {
 //     name: 'Dashboard',
 //     url: 'dashboard',
 //     icon: 'speed',
 //     action: false,
 //     expandable: false
 //   },

 //   {
 //     name: 'Assets & Liab',
 //     url: 'profile',
 //     icon: 'category',
 //     action: false,
 //     expandable: true,
 //     children: [
 //       {
 //         name: 'Liquidity',
 //         url: 'tabsandcards',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //       {
 //         name: 'Maturity Profile',
 //         url: 'analytics',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //       {
 //         name: 'Portfolio ',
 //         url: 'analytics',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //       {
 //         name: 'Exposure',
 //         url: 'outlook',
 //         icon: 'fingerprint',
 //         action: false
 //       },
 //     ]
 //   },
 //   {
 //     name: 'Sales',
 //     url: '',
 //     icon: 'qr_code',
 //     action: false,
 //     expandable: true,
 //     children: [
 //       {
 //         name: 'TradeFlow ',
 //         url: 'tradesflow',
 //         icon: 'fingerprint',
 //         action: false
 //       },

 //       {
 //         name: 'Wallet Sizing',
 //         url: 'walletsizing',
 //         icon: 'fingerprint',
 //         action: false
 //       },
 //       {
 //         name: 'FX Blotter',
 //         url: 'fxblotter',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //       {
 //         name: 'FX Flows',
 //         url: 'fxflows',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //     ]
 //   },

 //   {
 //     name: 'Trading',
 //     url: 'dash-ui',
 //     icon: 'list',
 //     action: false,
 //      expandable: true,
 //     children: [
 //       {
 //         name: 'Trading Blotter',
 //         url: 'profile',
 //         icon: 'contact_page',
 //         action: false
 //       },

 //     ]
 //   },

 //   {
 //     name: 'Reporting',
 //     url: 'reporting',
 //     icon: 'admin_panel_settings',
 //     action: false,
 //     expandable: true,
 //     children: [
 //       {
 //         name: 'Periodic Sales',
 //         url: 'sales-per-period',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //       {
 //         name: 'Reporting 2',
 //         url: 'app1',
 //         icon: 'fingerprint',
 //         action: false
 //       },
 //     ]
 //   },

 //   {
 //     name: 'Configuration',
 //     url: 'main',
 //     icon: 'admin_panel_settings',
 //     action: false,
 //     expandable: true,
 //     children: [
 //       {
 //         name: 'Settings',
 //         url: 'settings',
 //         icon: 'contact_page',
 //         action: false
 //       },
 //       {
 //         name: 'Side Panel',
 //         url: 'app1',
 //         icon: 'fingerprint',
 //         action: false
 //       },
 //     ]
 //   },


 // ];
 links = childRoutes

 currentSubMenuIndex: number | null = null;
 constructor() {}

 ngOnInit(): void {
   // this.isSidebarOpen = false
   this.isSidebarReduced = true
 }
 // component property to check if a menu has children
  hasChild = ( menu:MenuNode) => !!menu.children && menu.children.length > 0;

 // get the list of menus of any menu item
  getListofMenu(myAray: MenuNode[]): string[] {
     let output: string[] = [];
     myAray.forEach((element) => {
       output.push(element.name)
   });
   return output;
  }

  toggleSubMenu(index: number): void {
   if (this.currentSubMenuIndex === index) {
     // If the clicked submenu is already open, close it
     this.currentSubMenuIndex = null;
   } else {
     // Open the clicked submenu and close all others
     this.currentSubMenuIndex = index;
   }
 }

}
