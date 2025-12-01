import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  initializePagInationPayload,
  IPaginationPayload,
} from '../../../core/interface/request/genericPayload';
import {
  createPaginationMetadata,
  PaginationControlMetadata,
} from '../../../core/interface/model/pagination-detail.model';
import { handlePagination } from '../../../core/utils/pagination.util';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import {
  CustomerResponse,
  ICustomerResponse,
} from '../../../core/interface/response/customer.response';
import { MatDialog } from '@angular/material/dialog';
import { CustomerUpsert } from '../customer-upsert/customer-upsert';
import { ApiRoutes, EToastType, ToastService } from '@shared';
import { PaginationController } from '../../../component/pagination-controller/pagination-controller';
import { SearchBase } from '../../../core/base/search-base';
import { Observable } from 'rxjs';
import { SearchBar } from '../../../component/search-bar/search-bar';

@Component({
  selector: 'app-customer-list',
  imports: [PaginationController, SearchBar],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList
  extends SearchBase<IGenericResponse<ICustomerResponse>>
  implements OnInit
{
  public readonly dialog = inject(MatDialog);
  public searchInput = new FormControl('');
  public payload: IPaginationPayload = initializePagInationPayload();
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();
  public customers: WritableSignal<CustomerResponse[]> = signal([]);
  constructor(private toaster: ToastService) {
    super();
  }

  // Open PopUp
  public openModel(id: number = 0) {
    console.log(id);
    const dialogRef = this.dialog.open(CustomerUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form Submitted:', result);
      }
    });
  }

  protected override getData(): Observable<IGenericResponse<ICustomerResponse>> {
    return this.httpPostObservable<IGenericResponse<ICustomerResponse>, IPaginationPayload>(
      ApiRoutes.CUSTOMERS.CUSTOMER_ALL,
      this.payload
    );
  }

  protected override dataLoadedHandler(response: IGenericResponse<ICustomerResponse>): void {
    if (response?.data && response.data?.total) {
      this.customers.set(response.data.customers);
      handlePagination(
        this.paginationMetaData,
        response.data.total,
        this.payload.pageIndex,
        this.payload.top
      );
    } else {
      this.customers.set([]);
    }
  }

  public searchText(searchText: string) {
    this.payload.search = searchText;
    this.searchString$.next(searchText);
    this.payload.pageIndex = 1;
    this.search();
  }

  // Delete Customer
  public deleteCustomer(id: number) {
    this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.CUSTOMERS.GET_BY_ID(id))
      .then((response) => {
        if (response) {
          if (response.data) {
            this.toaster.show({
              message: 'Customer Delete Successful',
              duration: 3000,
              type: EToastType.success,
            });
            this.search();
          }
        }
      })
      .catch((error) => {
        // handle error
      });
  }

  public topChange(top: number) {
    this.payload.top = top;
    this.payload.pageIndex = 1;
    this.search();
  }

  public pageChange(pageIndex: number) {
    this.payload.pageIndex = pageIndex;
    this.search();
  }
}
