import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmployeeList } from '../employee-list/employee-list';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { ApiRoutes, ErrorHandler, EToastType, patternWithMessage, ToastService, ValidateControl } from '@shared';
import { IEmployee, IEmployeeForm } from '../employee.model';



@Component({
  selector: 'app-employee-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    email: new FormControl('', [Validators.required, patternWithMessage(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address (e.g. example@domain.com).')]),
    contact: new FormControl('', [Validators.required, patternWithMessage(/^[6-9]\d{9}$/, 'Please enter a valid contact number.')]),
    userType: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required,  Validators.maxLength(70)]),
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
      // this.employeeForm.updateValueAndValidity({ emitEvent: true });
    }
  }



}
