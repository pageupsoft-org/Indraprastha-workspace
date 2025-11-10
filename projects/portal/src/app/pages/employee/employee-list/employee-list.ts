import { Component, OnInit } from '@angular/core';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { IEmployee, IEmployeeResponse } from '../../../core/interface/response/employee';
import { intializepagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { registerForm, registerPayload } from '../../../core/interface/request/request';
import { Base, Validation } from '@portal/core';
// import { apiRoutes, Base, Validation } from '@Core';



@Component({
  selector: 'app-employee-list',
  imports: [PaginationController, Validation, ReactiveFormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList extends Base implements OnInit {
  public payLoad: IPaginationPayload = intializepagInationPayload()
  public paginationMetadata: PaginationControlMetadata = createPaginationMetadata();
  public employees: IEmployee[] = [];
  public employeeForm: boolean = false;
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
    super()
  }

  ngOnInit(): void {
    this.getEmployee()
  }

  public getEmployee() {
    this.httpPostPromise<IGenericResponse<IEmployeeResponse>, IPaginationPayload>(this.apiRoutes.EMPLOYEE.GET, this.payLoad).then(response => {
      if (response && response.data) {
        this.employees = response.data.employees;
        console.log(this.employees)
      }
    }).catch((error) => {

    })
  }

  public addEmployee() {
    this.employeeForm = !this.employeeForm;
  }

  public toggleMode() {
    this.isLoginMode = !this.isLoginMode
    console.log(this.btn);
    if (this.btn === '+ Add') {
      this.registerForm.controls.username.setErrors({ 'required': true });
      this.registerForm.controls.password.setErrors({ 'required': true });
    }
    this.btn = !this.isLoginMode ? '+ Add' : 'Cancel';
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
        username: this.registerForm.controls.username.value || '',
        password: this.registerForm.controls.password.value || ''
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

  public deleteEmployee(id: number) {
    if (id) {
      this.httpDeletePromise(this.apiRoutes.EMPLOYEE.GETBYID(id)).then((response) => {
        console.log()
      })
        .catch((error) => {

        })
    }
  }
 
  public fetchEmployee(id:number){
   this.httpGetPromise<any>(this.apiRoutes.EMPLOYEE.GETBYID(id)).then((response)=>{
   console.log(response)
   }).catch((error)=>{
   console.log(error)
   })
  }

}
