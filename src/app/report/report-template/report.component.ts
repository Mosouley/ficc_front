import {
  Component,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { DataModel } from '../../model/data.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  standalone: true,
  imports:[MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule]
})
export class ReportComponent implements OnInit, AfterViewInit {

  @Input() modelEntity!: DataModel[];

  @Input()report_name='';

  // @Input()dataValues!: any[];

  displayedColumns!: string[];

  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  noData: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  // Modify the input property to update when dataValues changes
  @Input() set dataValues(values: any[]) {
    this.connectDataSource(this.modelEntity, values);
  }

  constructor() {
    // Initialize MatTableDataSource with an empty array
    this.dataSource = new MatTableDataSource<any[]>([]);
  }
  ngOnInit(): void {
    // if (this.dataValues) {
    //   this.connectDataSource(this.modelEntity, this.dataValues);
      this.doSortAndPaginate();
    // }

  }


  public connectDataSource(model: DataModel[], data: any[]): void {
    this.displayedColumns = model?.map((c) => c.columnName);

    this.dataSource.data = data;


    this.noData = this.dataSource
    .connect()
    .pipe(map((donnee) => donnee.length === 0));
    this.doSortAndPaginate();
    this.table?.renderRows();
  }

  // getTotal() {
  //   const colData = this.data
  //   return colData.map((t: number) => t).reduce((acc: number, value: number) => acc + value, 0);
  // }


   sumField(data: any, field: string | number) {
    return data.reduce((acc: any, obj: { [x: string]: any; hasOwnProperty: (arg0: any) => any; }) => acc + (obj.hasOwnProperty(field) ? obj[field] : 0), 0);
  }

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

}
