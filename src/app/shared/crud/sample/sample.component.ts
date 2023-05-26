
import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';

import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { DataModel } from '../../model/data.model';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {


  @Input()
  data: any;

  @Input()
  arrayData;

  @Input()
  service: DataService;

  @Input()
  title: string;

  @Input()
  initItem: any;

  @Input()
  dataModelList: DataModel[];

  @Input()
  arrayModelList: DataModel[];

  @Input()
  initForm: FormGroup;

  crudForm: FormGroup;
 panelOpenState = false;
  operation = 'add';

  myformValueChange$: any;
  selectedItem: any;

  @Input()
  enumElements = [] ;
  @Input()
  enumType: any;

  @Output ()
  selectedItemChange: EventEmitter<boolean> = new EventEmitter<boolean>();



  constructor(private fb: FormBuilder,
    public toastr: ToastrService
  ) {
    this.createForm();

  }

  ngOnInit() {
    this.initData();
    if (this.enumType != null) {
    this.enumElements = Object.keys(this.enumType).filter(f => !isNaN(Number(f)));
    }
    this.myformValueChange$ =  this.crudForm.valueChanges;
    this.myformValueChange$.subscribe( val => {
      // console.log(val);

    });
    // this.onChange();
  }

  getValues($event) {
    // console.log(this.selectedItem);
    this.crudForm.patchValue(this.selectedItem);
    // console.log(this.crudForm.value);
    // console.log(this.selectedItem);

  }

  onChange(event) {
    this.crudForm.valueChanges.subscribe(val => {
      this.selectedItem = this.crudForm.value;
      this.selectedItemChange.emit(this.selectedItem);
      //  console.log(this.selectedItem);
    });
  }
  createForm() {

    this.initForm ? this.crudForm = this.initForm : this.crudForm = this.fb.group({}) ;
  }

  loadData() {
    this.service.getAll().subscribe(data => {
      this.data = data;
    });
  }

  add() {
    const p = this.crudForm.value;
    this.service.create(p).subscribe(res => {
      this.loadData();
      this.toastr.success('Enregistrement effectue avec succes : Ref ' + p[0]);
    });
    this.initData();
  }

  update() {
      console.log(this.selectedItem);
    this.service.update(this.selectedItem).subscribe(res => {
      this.initData();
      this.loadData();
      this.toastr.success('Mise a jour effectuee avec succes : Ref ' + this.selectedItem);
    }, err => this.toastr.error('Attention, mise a jour echouee ')
    );
  }

  initData() {
    this.selectedItem = this.initItem;
    this.createForm();
  }

  delete() {
    this.service.delete(this.selectedItem.id).subscribe(res => {
      this.selectedItem = this.initItem;
      this.toastr.success('Suppression effectuee avec succes : Ref ' + this.selectedItem.id);
      this.loadData();
    });
  }


}
