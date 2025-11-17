import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmployeeList } from '../employee-list/employee-list';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { IEmployeeForm, IEmployee,  } from '../../../core/interface/request/employee.request';
import { ApiRoutes, ErrorHandler, EToastType, ToastService, ValidateControl } from '@shared';
import { patternWithMessage } from '../../../../../../shared/src/public-api';



@Component({
  selector: 'app-employee-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorHandler,
    ValidateControl
  ],
  templateUrl: './employee-upsert.html',
  styleUrl: './employee-upsert.scss',
})

export class EmployeeUpsert extends Base implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EmployeeList>);
  readonly data = inject(MAT_DIALOG_DATA);

  public employeeForm = new FormGroup<IEmployeeForm>({
    id: new FormControl(0),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, patternWithMessage(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address (e.g. example@domain.com).')]),
    contact: new FormControl('', [Validators.required]),
    userType: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    username: new FormControl(null),
    password: new FormControl(null),
    isLogin: new FormControl(false),
  });
  public isLoginMode: boolean = false;
  public btn: string = '+ Add'
  public removeLoginMode: boolean = false


  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    const id = this.data.id
    console.log(id)
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
      this.httpGetPromise<any>(ApiRoutes.EMPLOYEE.GETBYID(id)).then((response) => {
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
    // const updatePayload: updatePayload = {
    //   id: this.employeeForm.controls.id.value || 0,
    //   firstName: this.employeeForm.controls.firstName.value || '',
    //   lastName: this.employeeForm.controls.lastName.value || '',
    //   email: this.employeeForm.controls.email.value || '',
    //   isLogin: this.employeeForm.controls.isLogin.value || false,
    //   contact: this.employeeForm.controls.contact.value || '',
    //   address: this.employeeForm.controls.address.value || '',
    //   userType: this.employeeForm.controls.userType.value || ''
    // }
    if (this.employeeForm.valid) {
      if (this.data.id === 0) {
        this.httpPostPromise<IGenericResponse<number>, IEmployee>(ApiRoutes.LOGIN.REGISTER_EMPLOYEE, this.employeeForm.value as IEmployee).then(response => {
          if (response) {
            if (response.data) {
              this.onCancel(true)
              this.toaster.show({ message: 'Employee register Successful', duration: 3000, type: EToastType.success });
            }
          }
        })
          .catch(error => {
            // handle error
          });
      }
      else {
        this.httpPostPromise<IGenericResponse<number>, IEmployee>(ApiRoutes.EMPLOYEE.BASE, this.employeeForm.value as IEmployee).then(response => {
          if (response) {
            if (response.data) {
              this.onCancel(true)
              this.toaster.show({ message: 'Employee Update Successful', duration: 3000, type: EToastType.success });
            }
          }
        })
          .catch(error => {
            // handle error
          });
      }
    }
    else {
      this.employeeForm.markAllAsTouched();
    }
  }



}
