import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Injectable()
export class InvoiceModalService {

  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private dialog: MatDialog,
  ) { }


  open(): NgbModalRef {

        this.isOpen = true;
        const modalRef = this.modalService.open(InvoiceCreateComponent, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.clients = 1;

        modalRef.result.then((result) => {
          this.isOpen = false;
          }, (reason) => {
              this.isOpen = false;
            });

  return modalRef;
  }
}
