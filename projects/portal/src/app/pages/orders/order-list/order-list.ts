import { Component, OnInit } from '@angular/core';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { IOrder, IOrderResponse } from '../../../core/interface/response/order.response';
import { Base, handlePagination } from '@portal/core';
import { initializePagInationPayload } from '../../../core/interface/request/genericPayload';
// import { IOrderPagination } from '../../../core/interface/request/order.request';
import { ApiRoutes, EOrderStatus, EToastType, MConfirmationModalData, MStringEnumToArray, stringEnumToArray, ToastService } from '@shared';
import { Route, Router } from '@angular/router';
import { IChangeStatusForm, initializeIChangeStatusForm, IOrderPagination, IUpdateStatusRequest } from '../../../core/interface/request/order.request';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";


@Component({
  selector: 'app-order-list',
  imports: [ReactiveFormsModule, NgClass, PaginationController],
  templateUrl: './order-list.html',
  // styleUrl: './order-list.scss',
})
export class OrderList extends Base implements OnInit {

  public payLoad: IOrderPagination = {
    ...initializePagInationPayload(),
    startDate: null,
    endDate: null,
    customerId: 0,
    status: null
  };
  public changeStatusForm: FormGroup<IChangeStatusForm> = initializeIChangeStatusForm()
  public totalOrders: number = 0 
  public orders: IOrder[] = [];
  public statusValue: MStringEnumToArray[] = stringEnumToArray(EOrderStatus)
  public orderStatus: string | null = 'InProcess'
  public paginationMetadata: PaginationControlMetadata = createPaginationMetadata();
  constructor(private _toaster: ToastService, private router: Router) {
    super()
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  // Get All Orders
  private getAllOrders() {
    this.httpPostPromise<IGenericResponse<IOrderResponse>, IOrderPagination>(ApiRoutes.ORDERS.ALL, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
          this.orders = response.data.orders
          this.totalOrders = response.data.total
          handlePagination(
            this.paginationMetadata,
            response.data.total,
            this.payLoad.pageIndex,
            this.payLoad.top
          )
        }
      }
    })
  }

  // ADD ID WHEN USER VIEW OR UPDATE
  public routeToViewPage(orderId: number) {
    console.log(orderId, "orderid")
    this.router.navigate([this.appRoutes.ORDERS_UPSERT], {
      queryParams: {
        id: orderId,
      },
    });
  }

  // Delete Orders
  public deleteOrder(id: number) {
    if (id) {
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this Order?',
        yesText: 'Yes',
        noText: 'No'
      };

      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.COLLECTION.GET_BY_ID(id))
            .then(response => {
              if (response?.data) {
                this._toaster.show({
                  message: 'Collection deleted successfully',
                  duration: 3000,
                  type: EToastType.success
                });
                this.getAllOrders();
              }
            })
            .catch((error) => {
            });
        }
      })
    }
  }

  //change orderstatus
  public updateStatus() {
    console.log(this.changeStatusForm.value)
    const modalData: MConfirmationModalData = {
      heading: 'Confirm Delete',
      body: 'Are you sure you want change order status?',
      yesText: 'Yes',
      noText: 'No'
    };
    console.log(this.orderStatus)
    this.orderStatus = this.changeStatusForm.controls.orderStatus.value
    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        const payload = {
          id: this.changeStatusForm.controls.id.value,
          orderStatus: this.changeStatusForm.controls.orderStatus.value
        }
        this.httpPostPromise<IGenericResponse<boolean>, IUpdateStatusRequest>(ApiRoutes.ORDERS.CHANGE_STATUS, payload as IUpdateStatusRequest).then(response => {
          if (response) {
            if (response.data) {
              this._toaster.show({
                message: 'change Order Status Successfully',
                duration: 3000,
                type: EToastType.success
              });
            }
          }
        }).catch(error => {
          // handle error
        })
      }
    })
  }


  public topChange(top: number) {
    this.payLoad.top = top;
    this.getAllOrders();
  }

  public pageChange(pageIndex: number) {
    this.payLoad.pageIndex = pageIndex;
    this.getAllOrders();
  }

  

}
