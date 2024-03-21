import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
// import { InvoiceCreateComponent } from 'src/app/myapps/invoice/invoice-create/invoice-create.component';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css'],
    standalone: true,
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatInputModule, MatDialogActions, MatDialogClose]
})
export class UserLoginComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<UserLoginComponent>){}

}
