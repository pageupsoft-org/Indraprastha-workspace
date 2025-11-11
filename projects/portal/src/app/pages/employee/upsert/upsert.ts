import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { List } from '../list/list';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { IEmployeeForm, IEmployee } from '../../../core/interface/request/employee';
import { ApiRoutes, ErrorHandler, EToastType, ToastService } from '@shared';


@Component({
  selector: 'app-upsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorHandler
  ],
  templateUrl: './upsert.html',
  styleUrl: './upsert.scss',
})

export class Upsert extends Base implements OnInit {
  readonly dialogRef = inject(MatDialogRef<List>);
  readonly data = inject(MAT_DIALOG_DATA);

  public employeeForm = new FormGroup<IEmployeeForm>({
    id: new FormControl(0),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    contact: new FormControl('', [Validators.required]),
    userType: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    username: new FormControl(null),
    password: new FormControl(null),
    isLogin: new FormControl(false),
  });

  public isLoginMode: boolean = false;
  public btn: string = '+ Add'
  // public userType: string[] = ['Admin', 'User']

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    const id = this.data.id
    this.fetchEmployee(id)

  }

  // Close PopUp
  public onCancel(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  // Create New Employee & Update Employee
  public onSubmitEmployee() {
    console.log(this.employeeForm.value)
    if (this.employeeForm.valid) {
      this.httpPostPromise<IGenericResponse<number>, IEmployee>(this.apiRoutes.LOGIN.REGISTER_EMPLOYEE, this.employeeForm.value as IEmployee).then(response => {
        if (response) {
          if (response.data) {
            if (this.data.id === 0) {
              this.onCancel(true)
              this.toaster.show({ message: 'Employee register Successful', duration: 3000, type: EToastType.success });
            }
            else {
              this.onCancel(true)
              this.toaster.show({ message: 'Employee Update Successful', duration: 3000, type: EToastType.success });
            }
          }
        }
      })
        .catch(error => {
          // handle error
        });
    }
    else {
      this.employeeForm.markAllAsTouched();
    }
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

}
