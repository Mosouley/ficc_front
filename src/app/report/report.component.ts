import {
  Component,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { DataModel } from '../model/data.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { DailyRate } from '../model/daily_rate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent implements OnInit, AfterViewInit {
  reportType = [
    { id: 1, name: 'Daily FX Rates', dataEntity: [] },
    // { id: 2, name: 'Report 2', dataEntity: [] },
    // { id: 3, name: 'Report 3', dataEntity: [] },
    // { id: 4, name: 'Report4', dataEntity: [] },
    // { id: 5, name: 'Report 5', dataEntity: [] },
    // { id: 6, name: 'Report 6', dataEntity: [] },
    // { id: 7, name: 'Report 7 ', dataEntity: [] },
  ];
  reportPeriod = [
    {
      id: 1,
      name: 'Today ',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 2,
      name: 'Current Period',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 3,
      name: 'This Month',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 4,
      name: ' This Quater ',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 5,
      name: 'This Year',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 6,
      name: 'Select a Range',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
  ];

  dataEntity!: any[];

  @Input() modelEntity!: DataModel[];

  @Input() modelArrayEntity!: DataModel[];

  @Input() title!: string;
  report_name = 'Report of Daily FX Rates on : '

  selectedType = 0;

  selectedPeriod = 0;

  reportingData!: any[];

  dateForm!: FormGroup;
  setRange = false;

  @Input() data!: DailyRate[];
  isEnable = false;
  // utiliser mat-table
  displayedColumns!: string[];
  // dataSource = new MatTableDataSource([]);
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  noData: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    this.doSortAndPaginate();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
  public doSortAndPaginate(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.title = 'Select a report and a period';
    this.dateForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
  });
  this.dateForm.valueChanges.subscribe(data => {
    this.enableReport()

  });
}
  getPeriod(event: any) {
    this.selectedPeriod = event.target.value;
    this.setRange = false
    if (this.selectedPeriod == 6) {
      this.setRange = true
    }

    this.enableReport();
  }
  getReportType(event: any) {
    this.selectedType = event.target.value;
    this.enableReport();
  }
  setPeriodIntervals(choix: number) {
    const today = new Date();
    switch (Number(choix)) {
      case 1:
        this.reportPeriod[0].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        this.reportPeriod[0].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        break;
      case 2:
        this.reportPeriod[1].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        console.log(this.reportPeriod[1]);

        this.reportPeriod[1].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        break;

      case 3:
        this.reportPeriod[2].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        this.reportPeriod[2].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        break;
      case 4:
        this.reportPeriod[3].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth() - 2,
          1
        );
        this.reportPeriod[3].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        break;
      case 5:
        this.reportPeriod[4].timePeriod.startDay = new Date(
          today.getFullYear(),
          0,
          1
        );
        this.reportPeriod[4].timePeriod.endDay = new Date(
          today.getFullYear(),
          11,
          31
        );

        break;
      case 6:
        this.setRange = true
        this.reportPeriod[5].timePeriod.startDay = this.dateForm.controls['start_date'].value
        this.reportPeriod[5].timePeriod.endDay = this.dateForm.controls['end_date'].value
        break;

      default:
        this.reportPeriod[0].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay()
        );
        this.reportPeriod[0].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay()
        );

        break;
    }
  }

  enableReport() {
    this.isEnable = false

    if (this.selectedPeriod > 0 && this.selectedPeriod !== 6 ) {
      this.isEnable = true;
      this.title = ''
      this.title = this.report_name +
      this.reportPeriod[this.selectedPeriod - 1]['name'];
    } else {
      if (this.dateForm.valid) {
        this.isEnable = true;

      } else {
        this.isEnable = false;
        this.title = 'You must select a period ';
      }
  }
}

  populateReport() {


    this.setPeriodIntervals(this.selectedPeriod);
    this.setReportData(this.selectedType, this.selectedPeriod);
    this.doSortAndPaginate();
  }

  public connectDataSource(model: DataModel[], data: any[]): void {



    this.noData = this.dataSource
      .connect()
      .pipe(map((donnee) => donnee.length === 0));
    this.displayedColumns = model.map((c) => c.columnName);
    this.dataSource.data = data;

    this.doSortAndPaginate();
    this.table.renderRows();
  }

  getTotal(data: any[]) {
    return data.map((t) => t).reduce((acc, value) => acc + value, 0);
  }

  setReportData(type: number, intervalSelected: number) {
    const start = this.reportPeriod[intervalSelected - 1].timePeriod.startDay;
    const end = this.reportPeriod[intervalSelected - 1].timePeriod.endDay;
   
    this.dataEntity = this.data.filter((rate: DailyRate) => {
      return (
        new Date(rate.date).setHours(0, 0, 0, 0) >=
          new Date(start).setHours(0, 0, 0, 0) &&
        new Date(rate.date).setHours(0, 0, 0, 0) <=
          new Date(end).setHours(0, 0, 0, 0)
      );
    });

    this.title = ''
    this.title = this.report_name  +
      `${formatDate(start, 'mediumDate', 'en-US')}` +
      ' To ' +
      `${formatDate(end, 'mediumDate', 'en-US')}`;
    // Fcall the data source function

    this.dataSource = new MatTableDataSource<any>();



    this.connectDataSource(this.modelEntity, this.dataEntity);
  }
}
