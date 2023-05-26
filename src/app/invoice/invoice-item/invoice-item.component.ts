import { CashBalance } from './../../shared/model/cashBalance';

import { UserService } from './../../services/user.service';
import { InvoiceCreateComponent } from './../invoice-create/invoice-create.component';

import { PrintService } from './../../shared/print/print.service';
// import { GeneralService } from './../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from './../../shared/model/client';
import { Category } from './../../shared/model/category';
import { Produit } from './../../shared/model/produit';
// import { CategoryService } from './../../services/category.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
// import { ClientService } from './../../services/client.service';
import {
  Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, Inject
} from '@angular/core';
// import { ProduitService } from '../../services/produit.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceStatus, PaymentMode } from '../../shared/model/invoice';
import { TransactionLine } from '../../shared/model/transactionLine';
import { TransactionLineService } from '../../services/transactionLine.service';

import { HistoricCashBalanceService } from '../../services/HistoricCashBalance.service';
import { map, groupBy, reduce, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from '../../auth/token-storage.service';
import { User } from '../../shared/model/user';
import { from, Observable } from 'rxjs';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';


@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemComponent implements OnInit, OnDestroy, AfterViewInit {

  noData: any;
  receiveData;
  dataTx = []; // stock data
  public clients!: Client[];
  public invoiceForm!: UntypedFormGroup;
  public tableForm!: UntypedFormGroup;
  public produits!: Produit[];
  public filteredProduits!: Produit[][];
  public categories!: Category[];
  public category!: Category;
  public totalSum !: number;
  public myFormValueChanges$!: Observable<any>;
  public clientValueChange$!: Observable<any>;
  public myFormTotalInvoiceValueChange$: any;
  public selectedClient!: Client;
  public listTransactions: any;
  public isValid = false;
  public payMode = PaymentMode;
  public modes: any;
  public today ?= new Date();
  public accountBalances!: Observable<CashBalance[]>;
  private lastCashBalance!: Observable<CashBalance>;
  public activeUser!: User;
  public stockArray : any;
  private lastBalData: CashBalance = new CashBalance();
  // @Output()
  // emitInvoice: EventEmitter<Invoice> = new EventEmitter<Invoice>();

  public displayedColumns = ['categorie', 'produit', 'quantite', 'prixUnit',
    'totalInvoice', 'view', 'action'];
  public donneesSource = new MatTableDataSource<[]>();

  @ViewChild(MatTable)
  table!: MatTable<any>;

  constructor(
    // private clientService: ClientService,
    public fb: UntypedFormBuilder,
    // public categorieService: CategoryService,
    // public produitService: ProduitService,
    public invoiceService: InvoiceService,
    public transactionLineService: TransactionLineService,
    public currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public aRoute: ActivatedRoute,
    public route: Router,
    // private generalService: GeneralService,
    public cashService: HistoricCashBalanceService,
    public printService: PrintService,
    public toastr: ToastrService,
    public activeModal: NgbActiveModal,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<InvoiceCreateComponent>,
    public cdRef: ChangeDetectorRef,
    public tokenService: TokenStorageService,
    public userFetcher: UserService,
    private router: Router,
    private stockService: TransactionLineService

  ) {
    this.receiveData = data;

  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    // const modes = Object.keys(this.payMode);
    // console.log(modes);
    this.modes = Object.keys(this.payMode).filter(f => !isNaN(Number(f)));
    // Get the arrays of clients, products, and categories

    this.clients = this.aRoute.snapshot.data['clients'];
    this.categories = this.aRoute.snapshot.data['categories'];
    this.produits = this.aRoute.snapshot.data['produits'];
    // console.log( this.stockService.getAll());
    this.dataTx = this.aRoute.snapshot.data['transax'];

    this.accountBalances = this.cashService['cashBal'];
    this.cashService.getAll();


    // obtenir les stocks disponibles
    this.stockService.getAll().subscribe(res => this.dataTx = res);
    // console.log( this.dataTx);
    this.getTheStockByProduct();
    // create the form
    this.initData();
    this.filteredProduits = new Array<Produit[]>();
    // initialize stream on units
    this.myFormValueChanges$ = this.invoiceForm.controls['transax'].valueChanges;
    // console.log(this.myFormValueChanges$);
    // subscribe to the stream so listen to changes on units
    this.myFormValueChanges$.subscribe(units => {
      // this.updateTotalUnitPrice(units),
      this.updateFilteredProduits(units);
    });
    // Recuperer les changements du client
    this.clientValueChange$ = this.invoiceForm.controls['client'].valueChanges;
    this.clientValueChange$.subscribe(id => {
        this.selectedClient = this.clients.find(n => n.id = id)!;
    }
    );

    this.userFetcher.getAll().subscribe(liste => {
      this.activeUser = liste.find((u: { username: string; }) => u.username === this.tokenService.getUsername());
    });

    // set the date and the payment mode
    this.invoiceForm.controls['payMode'].patchValue(this.payMode.CASH);
    // this.invoiceForm.controls['dateTrans'].patchValue( new Date().setHours(0, 0, 0, 0));
    this.invoiceForm.valueChanges.subscribe(v => this.validateForm());
  }
  // Initialiase the form group
  initData() {
    // this.tableForm = new FormGroup({
    //   mytable: new FormControl()}
    // );
    // this.selectedItem = this.initItem;
    this.createForm();
  }
  // create the form if it does not exist
  createForm() {
    // this.invoiceForm ? this.invoiceForm = this.fb.group({}) :
    this.invoiceForm = this.fb.group({
      client: ['', Validators.required],
      dateTrans: ['', Validators.required],
      payMode: ['', Validators.required],
      totalInvoice: [{ value: '', disabled: true }, Validators.required],
      transax: ''                    // this.fb.array([this.getUnit()])
    });

  }

  // permet d'eviter des erreurs apres fermeture des boites de dialogues
  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }



  /**
   * Save form data into the invoice database and the transaction ones
   */
  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
    if (this.validateForm()) {

      // create a new invoice
      const invoice = new Invoice();
      // Give a static ref to the invoice that will always be unique
      invoice.invoiceRef = (new Date()).getFullYear() + 'F' + Math.round((new Date()).getTime() / 1000);
      //  OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      // initialize the list of transaction
      invoice.transactionLines = [];
      this.listTransactions = [];
      this.today = this.invoiceForm.get('dateTrans')!.value;
      invoice.dateTrans = this.today;
      invoice.statut = InvoiceStatus.PAYE;
      invoice.paymentMode = this.invoiceForm.controls['payMode'].value;
      invoice.client = this.selectedClient;

      // Recuperer celui qui fait l'action
      invoice.user = this.activeUser;

      this.getTransactionLines(this.donneesSource.data);

      invoice.transactionLines = [... this.listTransactions];
      //  invoice.totalInvoice = this.listTransactions.reduce(((sum, x) => sum + x.transAmount));
      invoice.totalInvoice = this.totalSum;

      this.invoiceService.create(invoice).subscribe(
        data => {
          // console.log('------vvvvvvvv^^^^^^^^-------');
          // this.accountBalances.subscribe( d => console.log(d));
            this.lastCashBalance =
            this.accountBalances.pipe(
            map(balances => balances.find(s => new Date(s.dateHisto!).getTime() === new Date(data['dateTrans']).getTime() &&
              s.payMode === data['paymentMode'])!));
            this.lastCashBalance.subscribe( don => this.lastBalData = don );

              if ((this.lastBalData === undefined || this.lastBalData === null)) {
                const cashEvent = new CashBalance();
                cashEvent.dateHisto = data.dateTrans;
                cashEvent.payMode = data.paymentMode;
                cashEvent.balance = data.totalInvoice;
                this.cashService.create(cashEvent);
                // send the notification
                this.toastr.success('Caisse initiale du jour : ' + cashEvent.balance);
                //  console.log('caisse initiale du jour :' + cashEvent);
                } else {
                this.lastCashBalance.subscribe(bal => {
                    bal.balance = bal.balance + data.totalInvoice;
                    this.lastBalData = bal;
                });

                // then update the balance and save
                // lastCashBalance.balance = lastCashBalance.balance + data.totalInvoice;

                this.cashService.update(this.lastBalData);
                // console.log('caisse bien mise a jour :' + lastCashBalance.balance);
                this.toastr.success('Caisse bien mise a jour  : ' + this.lastBalData.balance);
              }
              this.toastr.success('Facture generée avec succes : Ref ' + invoice.invoiceRef);
              this.donneesSource.data = [];
              this.updateTotalInvoice();
              this.table.renderRows();
            });

        }
      }

  // Mettre a jour la facture totale sur la base des lignes du tableau
  private updateTotalInvoice() {
    // this.validateForm();
    this.totalSum = 0;

    this.totalSum = this.donneesSource.data.reduce((prev, curr) => prev + curr['totalInvoice'], 0);
    // console.log(this.totalSum);

    this.invoiceForm.controls['totalInvoice'].patchValue(this.totalSum);
  }
  /**
 * Update prices as soon as something changed on units group
 */
  private updateFilteredProduits(items: any) {
    // get our units group controll
    for (const i in items) {
      if (items.hasOwnProperty(i)) {
        if (!(items[i].category === undefined) && !(items[i].category == null)) {
            this.filteredProduits[i] = this.produits.filter(
            produit => produit.category!['nameCategory'] === items[i].category
          );

        }

      }
    }
  }

  private getTransactionLines(items: any) {
    // tslint:disable-next-line:forin
    for (const i in items) {

      if (items.hasOwnProperty(i)) {
        const transax = new TransactionLine();
        transax.produit = this.produits.find(n => n['codeProd'] === items[i].codeProd);
        transax.quantity = items[i].quantite;
        transax.unitValue = items[i].prixUnit;
        transax.creditAmount = items[i].totalInvoice;
        transax.txDate = this.today;

        this.listTransactions.push(transax);
      }

    }

  }

  closeDialog() {
    this.dialogRef.close();
  }

  // launching the mat dialog of invoice
  addOrEditItem(line: number | null) {

    const ligne = this.donneesSource.data.filter((data: any, idx: number) => idx === line);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '65%';
    dialogConfig.height = '25%';
    dialogConfig.minHeight = '200px';
    dialogConfig.panelClass = 'my-mat-class';
    dialogConfig.data = {
      categories: this.categories,
      produits: this.produits,
      selectedRow: ligne['0']
    };

    const dialogRef = this.dialog.open(InvoiceCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: { data: TransactionLine[]; }) => {
      if (result && line == null) {

        // const newData = this.donneesSource.data.concat(result.data);
        // console.log(this.donneesSource.data);
        // this.getBilledByProduct(newData);

        // this.addRowData(result.data);


      } else if (result) {
        // console.log(result)
        this.updateRowData(result.data);
      } else {
        dialogRef.close();
      }

    });
  }

  addRowData(transax: TransactionLine) {
    // on recupere les donnees de la ligne envoyee
    // on les ajoute au tableau


    // this.donneesSource.data.push({
    //   category: transax.produit?.category,
    //   codeProd: transax.codeProd,
    //   quantite: transax.quantite,
    //   prixUnit: transax.prixUnit,
    //   totalInvoice: transax.quantite * transax.prixUnit
    // });

    // on rafrachit le tableau definit en childview
    this.table.renderRows();
    this.updateTotalInvoice();
  }

  updateRowData(selectedRow: any) {

    this.donneesSource.data.filter((data: any, idx: number) => {
      //  data.category ==
      data['category'] = selectedRow['category'];
      data['codeProd'] = selectedRow['codeProd'];
      data['quantite'] = selectedRow['quantite'];
      data['prixUnit'] = selectedRow['prixUnit'];
      data['totalInvoice'] = selectedRow['quantite'] * selectedRow['prixUnit'];
      this.table.renderRows();
      this.updateTotalInvoice();
    });
  }

  validateForm() {
    // Checking if invoice data are provided
    // console.log(this.donneesSource.data);

    if (!this.invoiceForm.controls['client'].value ||
      !this.invoiceForm.controls['dateTrans'].value ||
      !this.invoiceForm.controls['totalInvoice'].value ||
      this.donneesSource.data.length === 0) {
      this.isValid = false;
      //  console.log(this.donneesSource.data.length);
      // and if all stock are positive
      // } else if (this.stockArray) {
      // from(this.donneesSource.data)
      // .pipe(
      //   groupBy( tx => tx.produit.codeProd)
      // )
      //   this.getBilledByProduct();
      // this.isValid = false;
    } else {
      this.isValid = true;
    }

    // else if (this.table.dataSource..length === 0)
    //   this.isValid = false;
    return this.isValid;
  }
  deleteRowData(ligne: any) {
    this.donneesSource.data = this.donneesSource.data.filter(((data: any, idx: any) => idx !== ligne));
    this.updateTotalInvoice();
  }

  showList() {
    this.router.navigate(['/dashboard/invoice-list']);
  }

  getTheStockByProduct(): any {
    // transform into rxjs observable
    // 1. convert the array to observable
    // 2. groupBy the property value
    // 3. flatMap or mergeMap, to merge all the objects in a single object
    // 4.then on each object make the calculation need
    // 5. subscribe and push back in an array
    from(this.dataTx)
      .pipe(
        groupBy(tx => tx['produit']['codeProd']),
        // flatMap(group => group.pipe(toArray()))
        mergeMap(transac =>
          transac.pipe(
            reduce(
              (acc, curr) => {
                acc.produit = acc.produit || curr['produit'];
                // acc.produit.descProduit = curr.produit.descProduit ;
                acc.debitAmount += curr['debitAmount'] / curr['unitValue'];
                acc.creditAmount += curr['creditAmount'] / curr['unitValue'];
                acc.solde = acc.debitAmount - acc.creditAmount;
                return acc;
              },
              {
                produit: null, unitValue: 0,
                quantity: 0, debitAmount: 0, creditAmount: 0, solde: 0
              }
            )
          )
        )
      ).subscribe(result => this.stockArray.push(result));
    // console.log(this.stockArray);
    return this.stockArray;
  }

  // Get the total by product on the bill
  getBilledByProduct(liste: any[]): boolean {
    // transform into rxjs observable
    // 1. convert the array to observable
    // 2. groupBy the property value
    // 3. flatMap or mergeMap, to merge all the objects in a single object
    // 4.then on each object make the calculation need
    // 5. subscribe and push back in an array

    from(liste)
      .pipe(
        groupBy(tx => tx.produit?.codeProd),
        // flatMap(group => group.pipe(toArray()))
        mergeMap(transac =>
          transac.pipe(
            reduce(
              (acc, curr) => {
                acc.codeProd = acc.codeProd! || curr.produit?.codeProd!;
                // acc.produit.descProduit = curr.produit.descProduit ;
                acc.quantite += curr.quantity!;
                return acc;
              },
              {
                codeProd: null,
                quantite: 0
              }
            )
          )
        )
      ).subscribe(result => {
        const maLigne = this.stockArray.find((r: { [x: string]: { codeProd: null; }; }) => r['produit'].codeProd === result.codeProd);
        if (maLigne) {
          if (result.quantite >= maLigne['solde']) {
            this.isValid = false;
            this.toastr.error('Impossible de Facturer un total de ' + result.quantite +
              ' Pour ' + maLigne['produit'].codeProd + ' Stock Restant ' +
              maLigne['solde']);

          }

        }


      });


    // console.log(this.stockArray);
    // return this.stockArray;
    return false;
  }

  /**
 * Create form unit
 */
  // public getUnit() {
  //   const numberPatern = '^[0-9.,]+$';
  //   return this.fb.group({
  //     category: ['', Validators.required],
  //     codeProd: ['', Validators.required],
  //     quantite: [1, [Validators.required, Validators.pattern(numberPatern)]],
  //     prixUnit: ['', [Validators.required]],
  //     unitTotalPrice: [{ value: '', disabled: true }]
  //   });

  // }
  /**
 * Add new unit row into form
 */
  // public addUnit() {
  //   const control = <FormArray>this.invoiceForm.controls['items'];
  //   control.push(this.getUnit());

  // }

  /**
   * Remove unit row from form on click delete button
   */
  // private removeUnit(i: number) {
  //   const control = <FormArray>this.invoiceForm.controls['test'];
  //   control.removeAt(i);
  // }

  /**
   * Update prices as soon as something changed on units group
   */
  // private updateTotalUnitPrice(items: any) {
  // get our units group controll
  // const control = <FormArray>this.invoiceForm.controls['test'];
  // before recount total price need to be reset.
  // this.totalSum = 0;
  // for (const i in items) {
  //   if (items.hasOwnProperty(i)) {
  //     const totalUnitPrice = items[i].quantite * items[i].prixUnit;

  // now format total price with angular currency pipe
  // const totalUnitPriceFormatted = this.currencyPipe.transform(totalUnitPrice, 'XOF ', 'symbol-narrow', '1.2-2');
  // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
  // control.at(+i).get('unitTotalPrice').setValue(totalUnitPriceFormatted, { onlySelf: true, emitEvent: false });
  // update total price for all units
  //       this.totalSum += totalUnitPrice;
  //     }
  //   }
  // }

}


