import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Client } from '../../shared/model/client';
import { Produit } from '../../shared/model/produit';
import { Category } from '../../shared/model/category';

import { Invoice } from '../../shared/model/invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { groupBy, mergeMap, reduce } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-invoice-generate',
  templateUrl: './invoice-generate.component.html',
  styleUrls: ['./invoice-generate.component.scss']
})
export class InvoiceGenerateComponent implements OnInit, AfterViewInit {

  noData: any;
  invoiceList: any;
  clients!: Client[];
  produits!: Produit[];
  categories!: Category[];
  dataTx = [];
  stockArray = [];
  public displayedColumns = [ 'dateTrans', 'invoiceRef', 'client',
  'paymentMode', 'statut', 'totalInvoice', 'details', 'delete'
];
  public dataStream = new MatTableDataSource<Invoice>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public aRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.clients = this.aRoute.snapshot.data['clients'];
    this.categories = this.aRoute.snapshot.data['categories'];
    this.produits = this.aRoute.snapshot.data['produits'];
    this.dataTx = this.aRoute.snapshot.data['transax'];
    // this.getTheStockByProduct();
    this.refreshList();
  }
  ngAfterViewInit(): void {
    this.dataStream.sort = this.sort;
    this.dataStream.paginator = this.paginator;
  }
  refreshList() {
    this.invoiceService.getAll().subscribe(res => this.dataStream.data = res);
  }

  openForEdit(invoiceID: number) {
    this.router.navigate(['/invoice/edit/' + invoiceID]);
  }

  onInvoiceDelete(id: number) {
    if (confirm('Are you sure to delete this record?')) {
      this.invoiceService.delete(id).subscribe(res => {
        this.refreshList();
        this.toastr.warning('Deleted Successfully', 'Restaurent App.');
      });
    }
}


}
