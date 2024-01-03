import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashComponent } from './dash/dash.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { LogoutComponent } from './logout/logout.component';
import { BannerComponent } from './dash/banner.component';
import { PnlSummaryComponent } from '../report/pnl-summary/pnl-summary.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NavbarComponent,
    SidenavComponent,
    DashComponent,
    FooterComponent,
    SettingsPanelComponent,
    UserLoginComponent,
    LogoutComponent,
    BannerComponent,

  ],

  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    PnlSummaryComponent,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    NavbarComponent,
    SidenavComponent,
    RouterModule,
    DashComponent,
    FooterComponent,
    BannerComponent,
    PnlSummaryComponent

  ]
})
export class LayoutModule { }
