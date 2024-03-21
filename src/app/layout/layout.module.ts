import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { LogoutComponent } from './logout/logout.component';
import { PnlSummaryComponent } from '../report/pnl-summary/pnl-summary.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MaterialModule,
        PnlSummaryComponent,
        ReactiveFormsModule,
        SharedModule,
        UserLoginComponent,
        LogoutComponent
    ],
    exports: [
        RouterModule,
        PnlSummaryComponent
    ]
})
export class LayoutModule { }
