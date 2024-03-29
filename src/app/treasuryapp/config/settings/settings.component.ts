import { Observable } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DailyRateService } from 'src/app/shared/services/dailyrates.service';
import * as XLSX from 'xlsx';
import { ImportFileComponent } from '../import-file.component';
import { DataModel } from 'src/app/model/data.model';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from 'src/app/layout/layout-routing.module';
import { NavbarComponent } from 'src/app/layout/navbar/navbar.component';
import { SidenavComponent } from 'src/app/layout/sidenav/sidenav.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReportComponent } from 'src/app/report/report-template/report.component';

type AOA = any[][];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    SidenavComponent,
    NavbarComponent,
    ReportComponent
  ],
})
export class SettingsComponent implements OnInit {
  reportingData!: any[];
  newRates: any[] =[];
  model: DataModel[] = [];
  modelArrayEntity!: DataModel[];
  data!: AOA;
  totalCount: number = 0;
  nextUrl: string | null = null;
  totalPages = 0;
  offset = 50

  constructor(
    @Inject(MatDialog) private dialog: MatDialog,
    private daily: DailyRateService
  ) {}
  ngOnInit(): void {
    this.model = [
      new DataModel('date', 'Date', 'date', false, [], 'date'),
      new DataModel('ccy_code', 'Currency', 'string', false, 'code','uppercase'),
      new DataModel('rateLcy', 'Rate', 'number', false, []),
      new DataModel('last_updated', 'Last. Up', 'date', false, []),
    ];

    this.retrievRates();
  }

  onFileChange(evt: any) {
    /* wire up file reader */

    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    try {
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
        // console.log(this.data);
        this.reportingData = this.data
       // console.log(this.reportingData);
      };
     // console.log(target.files[0]); //done l'objet File

      reader.readAsBinaryString(target.files[0]);
    } catch (error) {
      console.error('Error importing file:', error);
      // Handle the error here...
    }
  }

  importFile() {
    document.getElementById('fileInput')!.click();
  }
  saveData() {
    // console.info(this.newRates.slice(1))
    this.daily.addMany(this.newRates).subscribe((resp) => {
      this.newRates = []

    });

  }

  retrievRates() {
    this.daily.listAll().subscribe((response: any) => {
      this.totalCount = response.count
      this.nextUrl = response.next
      this.reportingData = response.results;
    });

  }

  getNextPage(){
    if(this.nextUrl){
      this.retrievRates()
    }
  }

  importingFile() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    dialogConfig.height = '300px'; // Modify properties directly
    dialogConfig.width = '500px'; // Modify properties directly

    const dialogRef = this.dialog.open(ImportFileComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.newRates = result;
      // this.router.navigate(['.'], { relativeTo: this.route });
    });
  }
}
