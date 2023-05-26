

import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';


import { groupBy, mergeMap, reduce, map } from 'rxjs/operators';
import { formatDate } from '@angular/common';

import { from } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataModel } from '../model/data.model';
import { Entree } from '../model/entree';
import { Invoice } from '../model/invoice';
import { Spending } from '../model/spendings';
import { TransactionLine } from '../model/transactionLine';




@Component({
  selector: 'app-report-html',
  templateUrl: './report-html.component.html'

})
export class ReportHtmlComponent implements OnInit, AfterViewInit {

  reportType = [
    { id: 1, name: 'Report 1', dataEntity: [] },
    { id: 2, name: 'Report 2', dataEntity: [] },
    { id: 3, name: 'Report 3', dataEntity: [] },
    { id: 4, name: 'Report4', dataEntity: [] },
    { id: 5, name: 'Report 5', dataEntity: [] },
    { id: 6, name: 'Report 6', dataEntity: [] },
    { id: 7, name: 'Report 7 ', dataEntity: [] }
  ];
  reportPeriod = [
    { id: 1, name: 'Current Period',
    timePeriod: { startDay: new Date(), endDay: new Date() } },
    { id: 2, name: 'This Month',
    timePeriod: { startDay: new Date(), endDay: new Date() } },
    { id: 3, name: ' This Quater ',
    timePeriod: { startDay: new Date(), endDay: new Date() } },
    { id: 4, name: 'This Year',
    timePeriod: { startDay: new Date(), endDay: new Date() } },
    { id: 5, name: 'Select a Range',
    timePeriod: { startDay: new Date(), endDay: new Date() } }
  ];

      dataEntity: any[] = [];

      modelEntity: DataModel[] = [];

      modelArrayEntity: DataModel[] = [];

      title!: string;

      selectedType = 0;

      selectedPeriod = 0;
      dataInvoices!: Invoice[];
      invoice!: Invoice;
      dataEntrees!: Entree[];
      dataSpendings!: Spending[];
      dataTx: TransactionLine[] = [];
      data : any;
      isEnable = false;
      // utiliser mat-table
      displayedColumns: string[] = [];
      // dataSource = new MatTableDataSource([]);
      dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
      noData: any;

      @ViewChild(MatSort) sort!: MatSort;
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.dataInvoices = this.route.snapshot.data['invoices'];
    this.dataEntrees = this.route.snapshot.data['entrees'];
    this.dataSpendings = this.route.snapshot.data['spendings'];
    this.dataTx = this.route.snapshot.data['transax'];


    this.title = 'Selectionnez votre rapport et la période';

  }
  ngAfterViewInit(): void {
    this.doSortAndPaginate();
    // console.log(this.selectedType);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
public doSortAndPaginate(): void {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
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
        this.reportPeriod[0].timePeriod.startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        this.reportPeriod[0].timePeriod.endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          break;

        case 2:
        this.reportPeriod[1].timePeriod.startDay = new Date(today.getFullYear(), today.getMonth()  , 1);
        this.reportPeriod[1].timePeriod.endDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
        case 3:
        this.reportPeriod[2].timePeriod.startDay = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        this.reportPeriod[2].timePeriod.endDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
        case 4:
        this.reportPeriod[3].timePeriod.startDay = new Date(today.getFullYear(), 0, 1);
        this.reportPeriod[3].timePeriod.endDay = new Date(today.getFullYear(), 11, 31);

        break;
        case 5:
        this.reportPeriod[4].timePeriod.startDay = new Date(today.getFullYear(), today.getMonth(), today.getDay());
        this.reportPeriod[4].timePeriod.endDay = new Date(today.getFullYear(), today.getMonth(), today.getDay());

        break;

        default:
        this.reportPeriod[0].timePeriod.startDay = new Date(today.getFullYear(), today.getMonth(), today.getDay());
        this.reportPeriod[0].timePeriod.endDay = new Date(today.getFullYear(), today.getMonth(), today.getDay());

          break;
      }

      }

   setReportData(type: number, intervalSelected: number) {
    const start = this.reportPeriod[intervalSelected - 1].timePeriod.startDay;
    const end = this.reportPeriod[intervalSelected - 1].timePeriod.endDay;

    switch (Number(type)) {
      // donnees des transactions
      case 1:

      this.data = this.dataTx.filter (tx => tx.debitAmount === 0);

        this.dataEntity = this.data.filter((transac: TransactionLine) => {
        // tslint:disable-next-line:no-unused-expression
      return new Date(transac.txDate!).setHours(0, 0 , 0, 0) >= new Date(start).setHours(0, 0 , 0, 0) &&
      new Date(transac.txDate!).setHours(0, 0 , 0, 0) <= new Date(end).setHours(0, 0 , 0, 0) ; } );

      // console.log(this.dataEntity);

      this.title = 'Rapport des Ventes détaillées du ' +
      `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;

      this.modelEntity = [
        new DataModel('txDate', 'Date', 'date', false, []),
        new DataModel('produit', 'Produit', 'Array', false, []),
        new DataModel('quantity', 'Quantite', 'number', false, []),
        new DataModel('unitValue', 'Prix V.', 'number', false, []),
        new DataModel('creditAmount', 'Montant', 'number', false, [])
      ];
      this.modelArrayEntity = [
        new DataModel('codeProd', 'Code Produit', 'string', false, []),
      ];

      // Faire appel a la fonction de mat-table

       this.dataSource =  new MatTableDataSource<any>();
       this.connectDataSource(this.modelEntity, this.dataEntity);


        break;
        case 2:
      // Reporting des dépenses sur une periode
        // this.dataEntity = [...this.dataInvoices];
        this.dataEntity = this.dataSpendings.filter((spent: Spending) => {
          return new Date(spent.dateSpending!).setHours(0, 0 , 0, 0)  >= new Date(start).setHours(0, 0 , 0, 0) &&
          new Date(spent.dateSpending!).setHours(0, 0 , 0, 0)  <= new Date(end).setHours(0, 0 , 0, 0); } );
          this.title = 'Rapport des Depenses effectuees du ' +
        `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
        this.modelEntity = [
          new DataModel('id', 'ID', 'number', true, []),
          new DataModel('dateSpending', 'Date Dep', 'date', false, []),
          new DataModel('typeSpending', 'Type Depense', 'enum', false, []),
          new DataModel('valueSpending', 'Montant Depense', 'number', false, []),
          new DataModel('commentSpending', 'Commentaire', 'string', false, [])
        ];

        this.dataSource = new MatTableDataSource<any[]>([]);
         // Faire appel a la fonction de mat-table
      this.connectDataSource(this.modelEntity, this.dataEntity);
        break;

        case 3:
        // Reporting des mouvements de stocks sur une periode
        // initialize the entity data
       this.dataEntity = [];
        // Show the transactions, filter based on the interval sets by the user
        this.data = this.dataTx.filter((transac: TransactionLine) => {
          return new Date(transac.txDate!).setHours(0, 0 , 0, 0)  >= new Date(start).setHours(0, 0 , 0, 0) &&
          new Date(transac.txDate!).setHours(0, 0 , 0, 0)  <= new Date(end).setHours(0, 0 , 0, 0);
        } );
        // console.log(this.data);

        // transform into rxjs observable
        // 1. convert the array to observable
        // 2. groupBy the property value
        // 3. flatMap or mergeMap, to merge all the objects in a single object
        // 4.then on each object make the calculation need
        // 5. subscribe and push back in an array
        from(this.data)
        .pipe(
          groupBy( (tx: any) => tx.produit.codeProd),
          // flatMap(group => group.pipe(toArray()))
          mergeMap(transac =>
          transac.pipe(
            reduce(
              (acc, curr: any) => {
                acc.produit = acc.produit || curr.produit;
                // acc.produit.descProduit = curr.produit.descProduit ;
                acc.debitAmount += curr.debitAmount / curr.unitValue;
                acc.creditAmount += curr.creditAmount / curr.unitValue;
                acc.solde = acc.debitAmount - acc.creditAmount;
                return acc;
              },
              {   produit: null, unitValue: 0,
                quantity: 0, debitAmount: 0, creditAmount: 0, solde: 0 }
            )
          )
        )
      ).subscribe( result => this.dataEntity.push( result));

          this.title = ' Mouvements de stocks effectues du ' +
        `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
        this.modelEntity = [
        new DataModel('produit', 'Produit', 'Array', false, []),
        new DataModel('debitAmount', 'Entrees', 'number', false, []),
        new DataModel('creditAmount', 'Sorties', 'number', false, []),
        new DataModel('solde', 'Stock Restant', 'number', false, [])
        ];
        this.modelArrayEntity = [
          new DataModel('codeProd', 'Code Produit', 'string', false, [])

        ];

        this.dataSource =  new MatTableDataSource<any>();
        // console.log(this.dataEntity);

         // Faire appel a la fonction de mat-table
      this.connectDataSource(this.modelEntity, this.dataEntity);
        break;

        // Rapport sur la caisse
        case 4:
        // Reporting des mouvements de caisse sur une periode
        // initialize the entity data
       this.dataEntity = [];
        // Show the transactions, filter based on the interval sets by the user
        this.data = this.dataTx.filter((transac: TransactionLine) => {
          return new Date(transac.txDate!).setHours(0, 0 , 0, 0)  >= new Date(start).setHours(0, 0 , 0, 0) &&
          new Date(transac.txDate!).setHours(0, 0 , 0, 0)  <= new Date(end).setHours(0, 0 , 0, 0);
        } );
        // console.log(this.data);

        // transform into rxjs observable
        // 1. convert the array to observable
        // 2. groupBy the property value
        // 3. flatMap or mergeMap, to merge all the objects in a single object
        // 4.then on each object make the calculation need
        // 5. subscribe and push back in an array
        from(this.data)
        .pipe(
          groupBy( (tx: any) => tx.produit.codeProd),
          // flatMap(group => group.pipe(toArray()))
          mergeMap(transac =>
          transac.pipe(
            reduce(
              (acc, curr) => {
                acc.produit = acc.produit || curr.produit;
                // acc.produit.descProduit = curr.produit.descProduit ;
                acc.debitAmount += curr.debitAmount / curr.unitValue;
                acc.creditAmount += curr.creditAmount / curr.unitValue;
                acc.solde = acc.debitAmount - acc.creditAmount;
                return acc;
              },
              {   produit: null, unitValue: 0,
                quantity: 0, debitAmount: 0, creditAmount: 0, solde: 0 }
            )
          )
        )
      ).subscribe( result => this.dataEntity.push( result));

          this.title = ' Mouvements de stocks effectues du ' +
        `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
        this.modelEntity = [
        new DataModel('produit', 'Produit', 'Array', false, []),
        new DataModel('debitAmount', 'Entrees', 'number', false, []),
        new DataModel('creditAmount', 'Sorties', 'number', false, []),
        new DataModel('solde', 'Stock Restant', 'number', false, [])
        ];
        this.modelArrayEntity = [
          new DataModel('codeProd', 'Code Produit', 'string', false, [])

        ];

        this.dataSource =  new MatTableDataSource<any>();


         // Faire appel a la fonction de mat-table
      this.connectDataSource(this.modelEntity, this.dataEntity);
        break;

        // Rapport des resultats Charges produits de la periode
        case 5:
        // Reporting des mouvements de stocks sur une periode
        // initialize the entity data
       this.dataEntity = [];
        // Show the transactions, filter based on the interval sets by the user
        this.data = this.dataTx.filter((transac: TransactionLine) => {
          return new Date(transac.txDate!).setHours(0, 0 , 0, 0)  >= new Date(start).setHours(0, 0 , 0, 0) &&
          new Date(transac.txDate!).setHours(0, 0 , 0, 0)  <= new Date(end).setHours(0, 0 , 0, 0);
        } );



        // transform into rxjs observable
        // 1. convert the array to observable
        // 2. groupBy the property value
        // 3. flatMap or mergeMap, to merge all the objects in a single object
        // 4.then on each object make the calculation need
        // 5. subscribe and push back in an array
        from(this.data)
        .pipe(
          groupBy(
            (tx: any) => tx.produit.codeProd),
          // flatMap(group => group.pipe(toArray()))
          mergeMap(transac =>
          transac.pipe(
            reduce(
              (acc, curr) => {
                acc.produit = acc.produit || curr.produit;
                acc.debitAmount += curr.debitAmount / curr.unitValue;
                acc.creditAmount += curr.creditAmount / curr.unitValue;
                acc.solde = acc.debitAmount - acc.creditAmount;
                return acc;
              },
              {   produit: null, unitValue: 0,
                quantity: 0, debitAmount: 0, creditAmount: 0, solde: 0 }
            )
          )
        )
      ).subscribe( result => this.dataEntity.push(result));

          this.title = ' Mouvements de stocks effectues du ' +
        `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
        this.modelEntity = [
        new DataModel('produit', 'Produit', 'Array', false, []),
        new DataModel('debitAmount', 'Entrees', 'number', false, []),
        new DataModel('creditAmount', 'Sorties', 'number', false, []),
        new DataModel('solde', 'Stock Restant', 'number', false, [])
        ];
        this.modelArrayEntity = [ new DataModel('codeProd', 'Code Produit', 'string', false, []) ];

        this.dataSource =  new MatTableDataSource<any>();
        // console.log(this.dataEntity);

         // Faire appel a la fonction de mat-table
      this.connectDataSource(this.modelEntity, this.dataEntity);
        break;
        case 6:

      // this.dataEntity = [...this.dataInvoices];
      this.dataEntity = this.dataInvoices.filter((inv: Invoice) => {
        // console.log(new Date(inv.dateTrans).setHours(0, 0 , 0, 0) );

        // tslint:disable-next-line:no-unused-expression
        return new Date(inv.dateTrans!).setHours(0, 0 , 0, 0)  >= new Date(start).setHours(0, 0 , 0, 0) &&
        new Date(inv.dateTrans!).setHours(0, 0 , 0, 0)  <= new Date(end).setHours(0, 0 , 0, 0); } );
        this.title = 'Rapport des Factures emises du ' +
      `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
        this.modelEntity = [
        new DataModel('id', 'ID', 'number', true, []),
        new DataModel('invoiceRef', 'Reference', 'string', false, []),
        new DataModel('dateTrans', 'Date Op', 'date', false, []),
        new DataModel('paymentMode', 'Mode', 'string', false, []),
        new DataModel('statut', 'statut', 'string', false, []),
        new DataModel('totalInvoice', 'Montant', 'number', false, [])
      ];

      this.dataSource =  new MatTableDataSource<any>();
       // Faire appel a la fonction de mat-table
       this.connectDataSource(this.modelEntity, this.dataEntity);
      break;

      case 7:
      this.data = this.dataTx.filter (tx =>  tx.creditAmount === 0);

      // this.dataEntity = [...this.dataInvoices];
      this.dataEntity = this.data.filter((tx: TransactionLine) => {
        // tslint:disable-next-line:no-unused-expression
      return new Date(tx.txDate!).setHours(0, 0 , 0, 0)  >= new Date(start).setHours(0, 0 , 0, 0) &&
      new Date(tx.txDate!).setHours(0, 0 , 0, 0)  <= new Date(end).setHours(0, 0 , 0, 0); } );


      this.title = 'Rapport des Appro de stock faits du ' +
      `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
      this.modelEntity = [
        new DataModel('id', 'ID', 'number', true, []),
        new DataModel('produit', 'Produit', 'Array', false, []),
        new DataModel('quantity', 'Quantite', 'number', false, []),
        new DataModel('txDate', 'Date Entree', 'date', false, []),
        new DataModel('debitAmount', 'Cout Total', 'number', false, [])
      ];
      this.modelArrayEntity = [
        new DataModel('codeProd', 'Code Produit', 'string', false, []),
      ];
      this.dataSource =  new MatTableDataSource<any>();
      // Faire appel a la fonction de mat-table
      this.connectDataSource(this.modelEntity, this.dataEntity);
      break;
      default:

      this.dataEntity = this.dataInvoices.filter((inv: Invoice) => {
        // tslint:disable-next-line:no-unused-expression
      return new Date(inv.dateTrans!).setHours(0, 0 , 0, 0) >= new Date(start).setHours(0, 0 , 0, 0) &&
      new Date(inv.dateTrans!).setHours(0, 0 , 0, 0) <= new Date(end).setHours(0, 0 , 0, 0) ; } );
      this.title = 'Rapport des Factures emises  du ' +
      `${formatDate(start, 'mediumDate', 'en-US')}` + ' au ' + `${formatDate(end, 'mediumDate', 'en-US')}`;
      this.modelEntity = [
        new DataModel('id', 'ID', 'number', true, []),
        new DataModel('invoiceRef', 'Reference', 'string', false, []),
        new DataModel('dateTrans', 'Date Op', 'date', false, []),
        new DataModel('client', 'Client', 'string', false, []),
        new DataModel('paymentMode', 'Mode', 'string', false, []),
        new DataModel('statut', 'statut', 'string', false, []),
        new DataModel('totalInvoice', 'Montant', 'number', false, [])
      ];
      this.dataSource =  new MatTableDataSource<any>();
       // Faire appel a la fonction de mat-table
       this.connectDataSource(this.modelEntity, this.dataEntity);
        break;
    }
  }

  populateReport() {
    this.doSortAndPaginate();
    this.setPeriodIntervals(this.selectedPeriod);
    this.setReportData(this.selectedType, this.selectedPeriod);
}

public connectDataSource( model: DataModel[], data: any []): void {
  this.noData = this.dataSource.connect().pipe(map(donnee => donnee.length === 0));
  // this.displayedColumns = model.map(c => c.columnName);
  this.dataSource.data = data;
  this.doSortAndPaginate();
  this.table.renderRows();
}

getTotal(data: any []) {
  return data.map(t => t).reduce((acc, value) => acc + value, 0);
}
// desc order pipe to show data in any report

// desc = (a, b) => {
  // tslint:disable-next-line:curly
  // if (a.key < b.key) return b.key;
// }
enableReport() {
  if (this.selectedType > 0 && this.selectedPeriod > 0) {
    this.isEnable = true;
    this.title = 'Rapport de ' + this.reportType[this.selectedType - 1]['name'] + ' sur '
    + this.reportPeriod[this.selectedPeriod - 1]['name'];
    // console.log(this.dataTx);
  } else {
    this.isEnable = false;
    this.title = 'Vous devez selectonner un type et une periode ';
  }
}
}
