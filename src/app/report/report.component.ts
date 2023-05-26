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

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent implements OnInit, AfterViewInit {
  reportType = [
    { id: 1, name: 'Report 1', dataEntity: [] },
    { id: 2, name: 'Report 2', dataEntity: [] },
    { id: 3, name: 'Report 3', dataEntity: [] },
    { id: 4, name: 'Report4', dataEntity: [] },
    { id: 5, name: 'Report 5', dataEntity: [] },
    { id: 6, name: 'Report 6', dataEntity: [] },
    { id: 7, name: 'Report 7 ', dataEntity: [] },
  ];
  reportPeriod = [
    {
      id: 1,
      name: 'Current Period',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 2,
      name: 'This Month',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 3,
      name: ' This Quater ',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 4,
      name: 'This Year',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 5,
      name: 'Select a Range',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
  ];

  @Input() dataEntity!: any[];

  @Input() modelEntity!: DataModel[];

  @Input() modelArrayEntity!: DataModel[];

  @Input() title!: string;

  selectedType = 0;

  selectedPeriod = 0;

  reportingData!: any[];

  data: any;
  isEnable = false;
  // utiliser mat-table
  displayedColumns!: string[];
  // dataSource = new MatTableDataSource([]);
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  noData: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private route: ActivatedRoute) {}
  ngAfterViewInit(): void {
    this.doSortAndPaginate();
    // console.log(this.selectedType);
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
  }
  getPeriod(event: any) {
    this.selectedPeriod = event.target.value;
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
          today.getDate() - 7
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
          1
        );
        this.reportPeriod[1].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        break;
      case 3:
        this.reportPeriod[2].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth() - 2,
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
          0,
          1
        );
        this.reportPeriod[3].timePeriod.endDay = new Date(
          today.getFullYear(),
          11,
          31
        );

        break;
      case 5:
        this.reportPeriod[4].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay()
        );
        this.reportPeriod[4].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay()
        );

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
    if (this.selectedType > 0 && this.selectedPeriod > 0) {
      this.isEnable = true;
      this.title =
        'Report ' +
        this.reportType[this.selectedType - 1]['name'] +
        ' sur ' +
        this.reportPeriod[this.selectedPeriod - 1]['name'];
      // console.log(this.dataTx);
    } else {
      this.isEnable = false;
      this.title = 'You must select a report type and a period ';
    }
  }

  populateReport() {
    this.doSortAndPaginate();
    this.setPeriodIntervals(this.selectedPeriod);
    this.setReportData(this.selectedType, this.selectedPeriod);
  }

  public connectDataSource(model: DataModel[], data: any[]): void {
    this.noData = this.dataSource
      .connect()
      .pipe(map((donnee) => donnee.length === 0));
    //  this.displayedColumns = model.map(c => c.columnName);
    console.log(model);

    this.displayedColumns = model
      .map((c) => c.columnName)
      .filter((columnName) => columnName !== undefined) as string[];
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

    this.data = this.reportingData; //.filter((tx) => tx.debitAmount === 0)
    console.log(this.data);

    //   this.dataEntity = this.data.filter((transac: []) => {
    //   // tslint:disable-next-line:no-unused-expression
    // return new Date(transac.txDate!).setHours(0, 0 , 0, 0) >= new Date(start).setHours(0, 0 , 0, 0) &&
    // new Date(transac.txDate!).setHours(0, 0 , 0, 0) <= new Date(end).setHours(0, 0 , 0, 0) ; } );

    // console.log(this.dataEntity);

    this.title =
      this.title +
      `${formatDate(start, 'mediumDate', 'en-US')}` +
      ' To ' +
      `${formatDate(end, 'mediumDate', 'en-US')}`;
    // Faire appel a la fonction de mat-table

    this.dataSource = new MatTableDataSource<any>();
    this.connectDataSource(this.modelEntity, this.dataEntity);
  }
}
