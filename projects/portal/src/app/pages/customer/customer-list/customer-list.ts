import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl } from '@angular/forms';
import { initializePagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { handlePagination } from '../../../core/utils/pagination.util';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { CustomerResponse, ICustomerResponse } from '../../../core/interface/response/customer.response';
import { MatDialog } from '@angular/material/dialog';
import { CustomerUpsert } from '../customer-upsert/customer-upsert';
import { ApiRoutes, EToastType, ToastService } from '@shared';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";


@Component({
  selector: 'app-customer-list',
  imports: [PaginationController],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})

export class CustomerList extends Base implements OnInit {
  public readonly dialog = inject(MatDialog);
  public searchInput = new FormControl('');
  public payload: IPaginationPayload = initializePagInationPayload();
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();
  public customers: CustomerResponse[] = [];
  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getCustomers()
  }

  // Open PopUp
  public openModel(id: number = 0) {
    console.log(id)
    const dialogRef = this.dialog.open(CustomerUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form Submitted:', result);
      }
    });
  }

  // Get Customers
  private getCustomers() {
    this.httpPostPromise<IGenericResponse<ICustomerResponse>, IPaginationPayload>(ApiRoutes.CUSTOMERS.CUSTOMER_ALL, this.payload).then(response => {
      if (response) {
        if (response.data) {
          this.customers = response.data.customers
         handlePagination(
              this.paginationMetaData,
              response.data.total,
              this.payload.pageIndex,
              this.payload.top
            )
        }
      }
    })
  }

  // Delete Customeru
  public deleteCustomer(id: number) {
    this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.CUSTOMERS.GET_BY_ID(id)).then(response => {
      if (response) {
        if (response.data) {
          this.toaster.show({ message: 'Customer Delete Successful', duration: 3000, type: EToastType.success });
          this.getCustomers();
        }
      }
    }).catch(error => {
      // handle error
    })
  }

  public topChange(top: number) {
    console.log("Top:", top);
    this.payload.top = top;
    this.getCustomers();
  }

  public pageChange(pageIndex: number) {
    console.log("Page Index:", pageIndex);
    this.payload.pageIndex = pageIndex;
    this.getCustomers();
  }

}
