import { Category } from './../../model/category';
import { Produit } from '../../model/product';

// import { GeneralService } from './../../services/data.service';
import { Router , ActivatedRoute } from '@angular/router';

// import { CategoryService } from './../../services/category.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
// import { ClientService } from './../../services/client.service';
import { Component, OnInit, Inject } from '@angular/core';
// import { ProduitService } from '../../services/produit.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceCreateComponent implements OnInit {


   public invoiceForm!: UntypedFormGroup ;
   public produits:Produit[] = [] ;
   public filteredProduits:Produit[] = [];
   public categories = [];
   public category!: Category;
   public totalSum = 0;
   public myFormValueChanges$: any;
   public myFormCategoryChanges$!: Observable<any>;
   public myFormProduitChanges$!: Observable<any>;
   public selectedRowData: any;
  private selectedProduit!: Produit ;

  constructor(

    public fb: UntypedFormBuilder,

    public currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public aRoute: ActivatedRoute,
    public route: Router,

    @Inject(MAT_DIALOG_DATA) public receiveData: any,
    public dialogRef: MatDialogRef<InvoiceCreateComponent>

  ) {

  }

  ngOnInit() {

            this.categories = this.receiveData.categories;  // this.aRoute.snapshot.data.categories;
            this.produits = this.receiveData.produits;  // this.aRoute.snapshot.data.produits;
            this.selectedRowData = this.receiveData.selectedRow;
            // create the form
            this.initData();


            // initialize stream on category to observe
            this.myFormCategoryChanges$ = this.invoiceForm.controls['category'].valueChanges;

            // initialize stream on prduct codes to observe
            this.myFormProduitChanges$ = this.invoiceForm.controls['codeProd'].valueChanges;

            // subscribe to the stream so listen to changes on categry
            this.myFormCategoryChanges$.subscribe((categ: string) => {
                this.updateFilteredProduits(categ);
            });

                // subscribe to the stream so listen to changes on produit
            this.myFormProduitChanges$.subscribe((prod: string) => {
                    this.updateSelectedProduct(prod);
                });
            this.invoiceForm.valueChanges.subscribe(v => {
              this.updateSomme();
              }
            );
  }
      /**
     * unsubscribe listeners
     */
      // ngOnDestroy(): void {
      //   this.myFormProduitChanges$.unsubscribe();
      //   this.myFormCategoryChanges$.unsubscribe();
      //   // this.invoiceForm.valueChanges
      // }

        // Initialiase the form group
        initData() {
        //  console.log(this.selectedRowData);

          this.createForm(this.selectedRowData);
        }
        // create the form if it does not exist
        createForm(item: { category: any; produit: any; quantite: any; prixUnit: any; totalInvoice: any; }) {
        //  item ?  console.log(item.produit) : console.log('rien');


           const numberPatern = '^[0-9.,]+$';
          item ? this.invoiceForm = this.fb.group({
            category: [item.category, Validators.required],
            codeProd: [item.produit, Validators.required],
            quantite: [item.quantite, [Validators.required, Validators.pattern(numberPatern)]],
            prixUnit: [item.prixUnit, [Validators.required, Validators.pattern(numberPatern)]],
            unitTotalPrice: [{ value: item.totalInvoice, disabled: true }]
          }) :

          this.invoiceForm = this.fb.group({
            category: ['', Validators.required],
            codeProd: ['', Validators.required],
            quantite: [1, [Validators.required, Validators.pattern(numberPatern)]],
            prixUnit: ['', [Validators.required, Validators.pattern(numberPatern)]],
            unitTotalPrice: [{ value: '', disabled: true }]
          });

        }

        /**
       * Update products as soon as something changed in the category
       */
        private updateFilteredProduits(category: string) {
          // get the list of produits given their category choosen

              if (!(category === undefined) && !(category == null)) {
                this.filteredProduits = this.produits.filter(
                  produit => produit!.category!.name === category
                );

          }
        }

        // get the price of a product based on the product code
        private updateSelectedProduct(prod: string) {
            // find the produit which has been selected
              if (!(prod === undefined) && !(prod == null)) {
                this.selectedProduit = this.filteredProduits.find( p => p['codeProd'] === prod)!;
                // this.invoiceForm.controls['codeProd'].patchValue(this.selectedProduit.codeProd);
                this.invoiceForm.controls['prixUnit'].patchValue(null);
              }

        }

      /**
       * Update prices as soon as something changed on units group
       */
      private updateSomme() {
            // get our units group controll

            // before recount total price need to be reset.
            this.totalSum = 0;

            const totalUnitPrice = this.invoiceForm.controls['quantite'].value * this.invoiceForm.controls['prixUnit'].value;
            // now format total price with angular currency pipe
            const totalUnitPriceFormatted = this.currencyPipe.transform(totalUnitPrice, 'XOF ', 'symbol-narrow', '1.2-2');
           // update total price for all units
            this.totalSum += totalUnitPrice;

          // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
            this.invoiceForm.controls['unitTotalPrice'].setValue(this.totalSum, { onlySelf: true, emitEvent: false });

      }

      // submit the line added to the invoice
      onSubmit() {
        // console.log(this.invoiceForm.value);

        // add the data on the matdialo to a list of the table
        this.dialogRef.close({data: this.invoiceForm.value});

        }

      closeDialog() {
        this.dialogRef.close();
      }

}

