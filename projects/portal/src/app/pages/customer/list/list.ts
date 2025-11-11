import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl } from '@angular/forms';
import { intializepagInationPayload, IPaginationPayload } from '../../../core/interface/request/genericPayload';
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { handlePagination } from '../../../core/utils/pagination.util';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { PaginationController } from '../../../component/pagination-controller/pagination-controller';
import { Customers, ICustomerResponse } from '../../../core/interface/response/customer';
import { MatDialog } from '@angular/material/dialog';
import { Upsert } from '../upsert/upsert';
import { ApiRoutes, EToastType, ToastService } from '@shared';


@Component({
  selector: 'app-list',
  imports: [PaginationController],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List extends Base implements OnInit {
  public readonly dialog = inject(MatDialog);
  public searchInput = new FormControl('');
  public payload: IPaginationPayload = intializepagInationPayload();
  public paginationMetadata: PaginationControlMetadata = createPaginationMetadata();
  public customers: Customers[] = [];

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getCustomers()
    handlePagination(
      this.paginationMetadata,
      100,
      1,
      10
    )
    // console.log(this.payload)
  }


  // Open PopUp
  public openModel(id: number = 0) {
    console.log(id)
    const dialogRef = this.dialog.open(Upsert, {
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
        }
      }
    })
  }

  // Delete Customeru
  public deleteCustomer(id: number) {
    this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.CUSTOMERS.GETBYID(id)).then(response => {
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

}
