
import { ReportHtmlComponent } from './report-html.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportComponent } from './report.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [ReportHtmlComponent, ReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule

  ],
  exports: [
    ReportComponent,
    ReportHtmlComponent
   ],
  providers: []
})
export class ReportModule {

}
