import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyRateService } from 'src/app/shared/services/dailyrates.service';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styles: [],
})
export class ImportFileComponent {
  title = 'Bulk Import: Rates';
  disabled = false;
  data!: AOA;
  file: any;
  target!: DataTransfer;
  constructor(
    public dialogRef: MatDialogRef<ImportFileComponent>,
    private daily: DailyRateService
  ) {}

  onFileChange(evt: any) {

    if (evt.target.files[0]) {
      this.disabled = false;

      this.target =  <DataTransfer>(evt.target);

    } else {
      this.disabled = true;
    }
  }

  importFile() {
    const mondoc = document!.getElementById('fileInput')!.click();
  }
  saveData() {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>this.target;
    //  if (target.files.length !== 1) throw new Error('Cannot use multiple files');
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
        // postign the data through the API
        this.daily.addMany(this.data.slice(1)).subscribe();
      // add the data on the matdialo to a list of the table
        this.dialogRef.close({ data: this.data });
      };
      reader.readAsBinaryString(target.files[0]);

    } catch (error) {
      console.error('Error importing file:', error);
      // Handle the error here...
    }
    //
    // this.http.post('/api/upload', this.data).subscribe(response => {
    //   console.log(response);
    // });
  }
}
