
import { ReportHtmlComponent } from './report-html.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { ReportComponent } from './report.component';
import { MaterialModule } from '../material/material.module';
import { FilterComponent } from './filter/filter.component';



@NgModule({
  declarations: [ReportHtmlComponent,  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    FilterComponent,
    ReportComponent
  ],
  exports: [
    ReportComponent,
    ReportHtmlComponent,
    ReactiveFormsModule
   ],
  providers: []
})
export class ReportModule {

}
