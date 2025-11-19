import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { ICustomer, ICustomerForm } from '../../../core/interface/request/customer.request';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerList } from '../customer-list/customer-list';
import { ApiRoutes, ErrorHandler, EToastType, ToastService, ValidateControl } from '@shared';
import { patternWithMessage } from '../../../../../../shared/src/public-api';

@Component({
  selector: 'app-customer-upsert',
  imports: [ReactiveFormsModule, ValidateControl],
  templateUrl: './customer-upsert.html',
  styleUrl: './customer-upsert.scss',
})

export class CustomerUpsert extends Base implements OnInit {
  public readonly dialogRef = inject(MatDialogRef<CustomerList>);
  public readonly data = inject(MAT_DIALOG_DATA);
  public customerRegisetr = new FormGroup<ICustomerForm>({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, patternWithMessage(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address (e.g. example@domain.com).')]),
    contact: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), patternWithMessage(/^[6-9]\d{9}$/, 'Please enter a valid contact number.')]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
  });
  public showPassword: boolean = false;

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
      this.httpGetPromise<any>(ApiRoutes.CUSTOMERS.GET_BY_ID(id)).then((response) => {
        if (response) {
          if (response.data) {
            this.customerRegisetr.patchValue(response.data)
          }
        }
      }).catch((error) => {

      })
    }

  }

   public togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
