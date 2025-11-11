import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { ICustomer, ICustomerForm } from '../../../core/interface/request/customer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { List } from '../list/list';
import { ApiRoutes, ErrorHandler, EToastType, ToastService } from '@shared';

@Component({
  selector: 'app-upsert',
  imports: [ReactiveFormsModule, ErrorHandler],
  templateUrl: './upsert.html',
  styleUrl: './upsert.scss',
})

export class Upsert extends Base implements OnInit {
  public readonly dialogRef = inject(MatDialogRef<List>);
  public readonly data = inject(MAT_DIALOG_DATA);
  public customerRegisetr = new FormGroup<ICustomerForm>({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    contact: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    const id = this.data.id
    this.fetchCustomer(id)
  }

  constructor(private toster: ToastService) {
    super();
  }

  // Close Model
  public onCancel() {
    this.dialogRef.close();
  }

  // Submit Customer Form
  public onSubmitCustomer() {
    // console.log(this.customerRegisetr.value);
    const customerPayload: ICustomer = {
      firstName: this.customerRegisetr.controls.firstName.value || '',
      lastName: this.customerRegisetr.controls.lastName.value || '',
      email: this.customerRegisetr.controls.email.value || '',
      contact: this.customerRegisetr.controls.contact.value || '',
      userName: this.customerRegisetr.controls.userName.value || '',
      password: this.customerRegisetr.controls.password.value || '',
    };
    if (this.customerRegisetr.valid) {
      this.httpPostPromise<IGenericResponse<boolean>, ICustomer>(ApiRoutes.LOGIN.REGISTER_CUSTOMER, customerPayload).then(response => {
        if (!response.errorMessage) {
          this.onCancel()
          this.toster.show({ message: "Customer Registration Successful", duration: 3000, type: EToastType.success });
        }
      })
        .catch(error => {
          // handle error
        });
    }
    else {
      this.customerRegisetr.markAllAsTouched();
    }
  }

  // Fetch Customer Data
  public fetchCustomer(id: number) {
    console.log(id)
    if (id) {
      this.httpGetPromise<any>(ApiRoutes.CUSTOMERS.GETBYID(id)).then((response) => {
        if (response) {
          if (response.data) {
            this.customerRegisetr.patchValue(response.data)
          }
        }
      }).catch((error) => {

      })
    }

  }

}
