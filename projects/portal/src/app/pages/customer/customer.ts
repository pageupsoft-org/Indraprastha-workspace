import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IGenericResponse } from '../../core/interface/response/responseGeneric';
import { customerForm , customerPayload} from '../../core/interface/request/customer';
import { Base, Validation } from '@portal/core';
import { EToastType, ToastService } from '@shared';

@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule, Validation],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})

export class Customer extends Base {
  public customerRegisetr = new FormGroup<customerForm>({
    // Define form controls here
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('',  Validators.required),
    email: new FormControl('',  Validators.required),
    contact: new FormControl('',  Validators.required),
    userName: new FormControl('',  Validators.required),
    password: new FormControl('',  Validators.required),
  })

  constructor(private toster:ToastService) {
    super();
  }

  public registerCustomer() {
    console.log(this.customerRegisetr.value);
    const customerPayload: customerPayload = {
      firstName: this.customerRegisetr.controls.firstName.value || '',
      lastName: this.customerRegisetr.controls.lastName.value || '',
      email: this.customerRegisetr.controls.email.value || '',
      contact: this.customerRegisetr.controls.contact.value || '',
      userName: this.customerRegisetr.controls.userName.value || '',
      password: this.customerRegisetr.controls.password.value || '',
    };
    if (this.customerRegisetr.valid) {
      this.httpPostPromise<IGenericResponse<boolean>, customerPayload>(this.apiRoutes.LOGIN.REGISTER_EMPLOYEE, customerPayload).then(response => {
       if(!response.errorMessage){
        this.toster.show({ message: "Registration Successful", duration: 3000, type: EToastType.success });
       }
      })
        .catch(error => {
           this.toster.show({ message: "Registration failed", duration: 3000, type: EToastType.error });
        });
    } else {
      this.customerRegisetr.markAllAsTouched();
    }
  }
}
