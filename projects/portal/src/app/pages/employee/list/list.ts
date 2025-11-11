import { Component, inject, OnInit } from '@angular/core';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { IEmployee, IEmployeeResponse } from '../../../core/interface/response/employee';
import { intializepagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Upsert } from '../upsert/upsert';
import { ApiRoutes, EToastType, ToastService } from '@shared';

@Component({
  selector: 'app-list',
  imports: [PaginationController, ReactiveFormsModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})

export class List extends Base implements OnInit {
  public payLoad: IPaginationPayload = intializepagInationPayload()
  public paginationMetadata: PaginationControlMetadata = createPaginationMetadata();
  public employees: IEmployee[] = [];
  public btn: string = '+ Add'
  public readonly dialog = inject(MatDialog);

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getEmployees()
  }

  // Get Employees
  public getEmployees() {
    this.httpPostPromise<IGenericResponse<IEmployeeResponse>, IPaginationPayload>(ApiRoutes.EMPLOYEE.GET, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
          this.employees = response.data.employees;
        }
      }
    }).catch((error) => {
    //   handel error
    })
  }

  // Open PopUp
  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(Upsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getEmployees()
      }
    });
  }

  // Delete Employees
  public deleteEmployee(id: number) {
    if (id) {
      this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.EMPLOYEE.GETBYID(id)).then(response => {
        if (response) {
          if (response.data) {
            this.toaster.show({ message: 'Delete Successful', duration: 3000, type: EToastType.success });
            this.getEmployees();
          }
        }
      })
        .catch((error) => {
          // handle error
        })
    }
  }

}
