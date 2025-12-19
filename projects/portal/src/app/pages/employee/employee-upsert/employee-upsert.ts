import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmployeeList } from '../employee-list/employee-list';
import { Base } from '../../../core/base/base';
import { ApiRoutes, NoLeadingTrailingSpaceDirective, NumberOnlyValidators, patternWithMessage, ToastService, ValidateControl } from '@shared';
import { IEmployee, IEmployeeForm } from '../employee.model';



@Component({
  selector: 'app-employee-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidateControl,
    NumberOnlyValidators,
    NoLeadingTrailingSpaceDirective
  ],
  templateUrl: './employee-upsert.html',
  styleUrl: './employee-upsert.scss',
})

export class EmployeeUpsert extends Base implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EmployeeList>);
  readonly data = inject(MAT_DIALOG_DATA);

  public employeeForm = new FormGroup<IEmployeeForm>({
    id: new FormControl(0),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15),]),
    email: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required, patternWithMessage(/^[6-9]\d{9}$/, 'Enter a valid contact number.')]),
    userType: new FormControl('',),
    address: new FormControl('', [Validators.required, Validators.maxLength(70)]),
    username: new FormControl(null, [Validators.minLength(3), Validators.maxLength(30)]),
    password: new FormControl(null, [Validators.minLength(8), Validators.maxLength(8)]),
    isLogin: new FormControl(false),
  });
  public isLoginMode: boolean = false;
  public btn: string = '+ Add'
  public removeLoginMode: boolean = false
  public passwordToggle: boolean = false;


  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    const id = this.data.id
    if (id === 0) {
      this.removeLoginMode = !this.removeLoginMode;
    }

    this.fetchEmployee(id)
  }

  // Close PopUp
  public onCancel(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  // Toggle Login Section
  public toggleMode() {
    this.isLoginMode = !this.isLoginMode
    if (this.btn === '+ Add') {
      this.employeeForm.controls.username.setErrors({ 'required': true });
      this.employeeForm.controls.password.setErrors({ 'required': true });
      this.employeeForm.controls.isLogin.setValue(true)
    } else {
      this.employeeForm.controls.username.clearValidators()
      this.employeeForm.controls.password.clearValidators()
      this.employeeForm.controls.username.reset()
      this.employeeForm.controls.password.reset()
      this.employeeForm.controls.isLogin.setValue(false)
    }
    this.btn = !this.isLoginMode ? '+ Add' : 'Cancel';
  }

  // Fetch Employee
  public fetchEmployee(id: number) {
    if (id) {
      this.httpGetPromise<any>(ApiRoutes.EMPLOYEE.GET_BY_ID(id)).then((response) => {
        if (response) {
          if (response.data) {
            this.employeeForm.patchValue({
              ...response.data,
              userType: response.data.userType || response.data.userTypeId
            });
          }
        }
      }).catch((error) => {
        // display error message
      })
    }
  }

  public onSubmitEmployee() {
    console.log(this.employeeForm.getRawValue())
    console.log(this.employeeForm, this.employeeForm.value)
    if (this.employeeForm.valid) {
      console.log(this.employeeForm, this.employeeForm.value)
      const payLoad = this.employeeForm.value as IEmployee
      console.log(payLoad)
      // if (this.data.id === 0) {
      //   this.httpPostPromise<IGenericResponse<number>, IEmployee>(ApiRoutes.LOGIN.REGISTER_EMPLOYEE, this.employeeForm.value as IEmployee).then(response => {
      //     if (response) {
      //       if (response.data) {
      //         this.onCancel(true)
      //         this.toaster.show({ message: 'Employee register Successful', duration: 3000, type: EToastType.success });
      //       }
      //     }
      //   })
      //     .catch(error => {
      //       // handle error
      //     });
      // }
      // else {
      //   this.httpPostPromise<IGenericResponse<number>, IEmployee>(ApiRoutes.EMPLOYEE.BASE, this.employeeForm.value as IEmployee).then(response => {
      //     if (response) {
      //       if (response.data) {
      //         this.onCancel(true)
      //         this.toaster.show({ message: 'Employee Update Successful', duration: 3000, type: EToastType.success });
      //       }
      //     }
      //   })
      //     .catch(error => {
      //       // handle error
      //     });
      // }
    }
    else {
      this.employeeForm.markAllAsTouched();
      // this.employeeForm.updateValueAndValidity({ emitEvent: true });
    }
  }

  // public allowOnlyNumbers(event: any) {
  //   const input = event.target as HTMLInputElement;
  //   const raw = input.value;          
  //   const value = raw.replace(/[^0-9]/g, '');  
  //   if (value === '') {
  //     this.employeeForm.controls.contact.setValue(null);
  //     return;
  //   }
  //   this.employeeForm.controls.contact.setValue(value);
  // }




}
