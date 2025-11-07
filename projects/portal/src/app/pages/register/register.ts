import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGenericResponse } from '../../core/interface/response/responseGeneric';
import { registerForm, registerPayload } from '../../core/interface/request/request';
import { Base, Validation } from '@Core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Validation],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register extends Base {
  public isLoginMode: boolean = false;
  public btn: string = '+ Add'
  public registerForm = new FormGroup<registerForm>({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contact: new FormControl('', [Validators.required]),
    userType: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    username: new FormControl(null),
    password: new FormControl(null),
  });

  constructor() {
    super();
  }

  public registerEmployee() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      const registerpayload: registerPayload = {
        firstName: this.registerForm.controls.firstName.value || '',
        lastName: this.registerForm.controls.lastName.value || '',
        email: this.registerForm.controls.email.value || '',
        contact: this.registerForm.controls.contact.value || '',
        userType: this.registerForm.controls.userType.value || '',
        address: this.registerForm.controls.address.value || '',
        username: this.registerForm.controls.username.value || null,
        password: this.registerForm.controls.password.value || null
      };
      this.httpPostPromise<IGenericResponse<boolean>, registerPayload>(this.apiRoutes.LOGIN.REGISTER_EMPLOYEE, registerpayload).then(response => {
        console.log('✅ Registration success:', response);
      })
        .catch(error => {
          console.log('Registration failed:', error);
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

 



}
