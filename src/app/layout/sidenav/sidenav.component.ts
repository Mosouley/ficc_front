import { MenuNode } from './../../shared/menu-node';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  // cards template to display the  dashboard on cards
  numCards = Array.from(Array(5).keys());
  // creating input and output variable for sidebar reduction
  @Input() isSidebarReduced = false;
  @Output () toggleSidebarReduce: EventEmitter<boolean> = new EventEmitter<boolean>();

  // creating input variable to toglle sidebar close/open
  @Input() isSidebarOpen = true;

  // variable sidebar links
  links: MenuNode[] = [
    {
      name: 'Dashboard',
      url: 'home',
      icon: 'speed',
      action: false,
      expandable: false
    },

    {
      name: 'Assets & Liab',
      url: 'profile',
      icon: 'category',
      action: false,
      expandable: true,
      children: [
        {
          name: 'Liquidity',
          url: 'tabsandcards',
          icon: 'contact_page',
          action: false
        },
        {
          name: 'Maturity Profile',
          url: 'analytics',
          icon: 'contact_page',
          action: false
        },
        {
          name: 'Portfolio ',
          url: 'analytics',
          icon: 'contact_page',
          action: false
        },
        {
          name: 'Exposure',
          url: 'outlook',
          icon: 'fingerprint',
          action: false
        },
      ]
    },
    {
      name: 'Sales',
      url: '',
      icon: 'qr_code',
      action: false,
      expandable: true,
      children: [

        {
          name: 'Wallet Sizing',
          url: 'walletsizing',
          icon: 'fingerprint',
          action: false
        },
        {
          name: 'FX Blotter',
          url: 'fxblotter',
          icon: 'contact_page',
          action: false
        },
        {
          name: 'FX Flows',
          url: 'fxflows',
          icon: 'contact_page',
          action: false
        },
      ]
    },

    {
      name: 'Trading',
      url: 'dash-ui',
      icon: 'list',
      action: false,
       expandable: true,
      children: [
        {
          name: 'Trading Blotter',
          url: 'profile',
          icon: 'contact_page',
          action: false
        },
        {
          name: 'Reports',
          url: '',
          icon: 'fingerprint',
          action: false
        },
      ]
    },

    {
      name: 'Configuration',
      url: 'main',
      icon: 'admin_panel_settings',
      action: false,
      expandable: true,
      children: [
        {
          name: 'Settings',
          url: 'settings',
          icon: 'contact_page',
          action: false
        },
        {
          name: 'Side Panel',
          url: 'app1',
          icon: 'fingerprint',
          action: false
        },
      ]
    },


  ];

  constructor(private localRouter: ActivatedRoute) {}

  ngOnInit(): void {

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


}
