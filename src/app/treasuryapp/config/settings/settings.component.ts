import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DailyRateService } from 'src/app/shared/services/dailyrates.service';
import * as XLSX from 'xlsx';
import { TradeComponent } from '../../fxblotter/trade.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportFileComponent } from '../import-file.component';
import { DailyRate } from 'src/app/model/daily_rate';
import { DataModel } from 'src/app/model/data.model';

type AOA = any[][];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  reportingData!: any[];
  model: DataModel[] = [];
  data!: AOA;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private daily: DailyRateService
  ) {}
  ngOnInit(): void {
    this.model = [
      new DataModel('id', 'ID', 'number', true, []),
      new DataModel('date', 'Date', 'date', false, []),
      new DataModel('ccy', 'Currency', 'string', false, []),
      new DataModel('rateLcy', 'Rate', 'number', false, []),
      new DataModel('last_update', 'Last. Up', 'date', false, []),
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
        console.log(this.data);
      };
      console.log(target.files[0]); //done l'objet File

      reader.readAsBinaryString(target.files[0]);
    } catch (error) {
      console.error('Error importing file:', error);
      // Handle the error here...
    }
  }

  importFile() {
    document!.getElementById('fileInput')!.click();
  }
  saveData() {
    this.daily.addMany(this.data.slice(1)).subscribe((resp) => {
      console.log(resp);
    });
    // this.http.post('/api/upload', this.data).subscribe(response => {
    //   console.log(response);
    // });
  }

  retrievRates() {
    // console.log(this.model);

    this.daily.list().subscribe((rates) => {
      // console.log(rates)
      this.reportingData = rates;
      // console.log(this.reportingData)
    });
  }

  importingFile() {
    let dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig = {
      height: '300px',
      width: '500px',
    };
    //  dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(ImportFileComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      this.data = data;
      console.log(this.data);

      this.router.navigate(['.'], { relativeTo: this.route });
    });
  }
}
