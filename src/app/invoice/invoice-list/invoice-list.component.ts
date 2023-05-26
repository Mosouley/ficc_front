import { NotificationsComponent } from './../../shared/notifications/notifications.component';
import { Invoice } from './../../shared/model/invoice';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../shared/model/client';
import { Produit } from '../../shared/model/produit';
import { Category } from '../../shared/model/category';
import { InvoiceService } from '../../services/invoice.service';

import { InvoiceCreateComponent } from '../invoice-create/invoice-create.component';
import { map, filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit, AfterViewInit {


  noData: any;
  invoiceList!: Invoice[];
  clients!: Client[];
  produits!: Produit[];
  categories!: Category[];
  dataTx = [];

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
    private toastr: ToastrService,
    public auth: AuthService
  ) {
    // this.dataStream.data = this.invoiceList;
  }

  ngOnInit() {
    this.clients = this.aRoute.snapshot.data['clients'];
    this.categories = this.aRoute.snapshot.data['categories'];
    this.produits = this.aRoute.snapshot.data['produits'];

    this.dataStream.data  = this.aRoute.snapshot.data['invoiceData'].filter( (inv: Invoice) => {

               // tslint:disable-next-line:no-unused-expression
           return new Date(inv.dateTrans!).setHours(0, 0 , 0, 0) >= new Date().setHours(0, 0 , 0, 0);
    });
    // this.noData = this.dataStream.connect().pipe(map(donnee => donnee.length === 0));
  }

    ngAfterViewInit(): void {
      this.dataStream.sort = this.sort;
      this.dataStream.paginator = this.paginator;
    }

    goBackToInvoice() {
      this.router.navigate(['/dashboard/invoice-generate']);
    }

  openForEdit(inv: Invoice) {
    // getInvoiceDetails
    // console.log(inv);

     this.router.navigate(['/dashboard/invoice/edit/' + inv.id]);
  }

  onInvoiceDelete(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '350px';
    dialogConfig.height = '25%';
    dialogConfig.data = 'Etes-vous sûr de vouloir supprimer ?' ;
    // dialogConfig.minHeight = '200px';
    dialogConfig.panelClass = 'my-mat-class';
    const dialogRef = this.dialog.open(NotificationsComponent, dialogConfig
      );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invoiceService.delete(id).subscribe(res => {

            this.dataStream.data = this.dataStream.data.filter(((data, idx) => idx !== id));
            this.toastr.warning('Deleted Successfully', 'Restaurent App.');


        });
      }
    });

    // if (confirm('Are you sure to delete this record?')) {
    //   this.invoiceService.delete(id).subscribe(res => {
        // this.refreshList();
      //   this.toastr.warning('Deleted Successfully', 'Restaurent App.');
      // });
    // }
}

// launching the mat dialog of invoic
}
