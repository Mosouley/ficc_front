import { ActivatedRoute, Router } from '@angular/router';
import { LogoutComponent } from './../logout/logout.component';
import { UserLoginComponent } from './../user-login/user-login.component';

import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MenuNode } from './menu-node';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit  {
    isSidebarOpen = false;
    routeQueryParams$: Subscription | undefined;

    username!: string;
    password!: string;
    remember = false;

    @Output () toggleSideNav: EventEmitter<boolean> = new EventEmitter<boolean>();

    links: MenuNode[] = [
      {
        name: 'User',
        url: 'main',
        icon: 'speed',
        action: false,
        expandable: true,
        children: [
          {
            name: 'Login',
            url: 'profile',
            icon: 'category',
            action: false,
            expandable: true,
            children: [
              {
                name: 'Tabs and Cards',
                url: 'tabsandcards',
                icon: 'contact_page',
                action: false
              },
              {
                name: 'Analytics',
                url: 'analytics',
                icon: 'contact_page',
                action: false
              },
              {
                name: 'Outlook',
                url: 'outlook',
                icon: 'fingerprint',
                action: false
              },
            ]
          },
          {
            name: 'Register',
            url: 'profile',
            icon: 'category',
            action: false,
            expandable: true,
          }
        ]
      },



    ];



    constructor(
      public dialog: MatDialog,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.routeQueryParams$ = route.queryParams.subscribe(params => {
        if (params['login']) {
          this.loginOpen();
        }
      });
    }

    ngOnInit(): void {
      this.isSidebarOpen = false;
    }
    loginOpen() {

      let dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = false;
      dialogConfig = {
        height: '450px',
        width: '600px',
        data:  {
          username: this.username,
          password: this.password,
          remember: this.remember
        }};
      //  dialogConfig.autoFocus = true;
       let dialogRef = this.dialog.open(UserLoginComponent, dialogConfig);

       dialogRef.afterClosed().subscribe( result => {

        this.username = result.username
        this.password = result.password
        this.remember = result.remember
        console.log( 'User connected with ' + this.username + ' --- ' + this.password + ' + . ' + this.remember) ;

        this.router.navigate(['.'], {relativeTo: this.route})
       });
    }

    dialogLogout() {
      let dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = false;
      dialogConfig = {
        height: '600px',
        width: '500px',


      }
      dialogConfig.autoFocus = true;
      this.dialog.open(LogoutComponent, dialogConfig);

    }

    ngOnDestroy(): void {
      this.routeQueryParams$?.unsubscribe();
    }
}
