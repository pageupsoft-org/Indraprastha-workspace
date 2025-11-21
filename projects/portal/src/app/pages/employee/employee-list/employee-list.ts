import { Component, inject, OnInit } from '@angular/core';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { IEmployee, IEmployeeResponse } from '../../../core/interface/response/employee.response';
import { initializePagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeUpsert } from '../employee-upsert/employee-upsert';
import { ApiRoutes, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { handlePagination } from '@portal/core';

@Component({
  selector: 'app-employee-list',
  imports: [PaginationController, ReactiveFormsModule, PaginationController],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})

export class EmployeeList extends Base implements OnInit {
  public payLoad: IPaginationPayload = initializePagInationPayload()
  public paginationMetadata: PaginationControlMetadata = createPaginationMetadata();
  public employees: IEmployee[] = [];
  public btn: string = '+ Add'
  public readonly dialog = inject(MatDialog);

  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  // Get Employees
  public getEmployees() {
    this.httpPostPromise<IGenericResponse<IEmployeeResponse>, IPaginationPayload>(ApiRoutes.EMPLOYEE.GET, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
          this.employees = response.data.employees;
          handlePagination(
            this.paginationMetaData,
            response.data.total,
            this.payLoad.pageIndex,
            this.payLoad.top
          )
        }
      }
    }).catch((error) => {
      //   handel error
    })
  }

  // Open PopUp
  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(EmployeeUpsert, {
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
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this Employee?',
        yesText: 'Yes',
        noText: 'No'
      };
      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.EMPLOYEE.GET_BY_ID(id)).then(response => {
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
      })

    }
  }

  public topChange(top: number) {
    console.log("Top:", top);
    this.payLoad.top = top;
    this.getEmployees();
  }

  public pageChange(pageIndex: number) {
    console.log("Page Index:", pageIndex);
    this.payLoad.pageIndex = pageIndex;
    this.getEmployees();
   }

}
