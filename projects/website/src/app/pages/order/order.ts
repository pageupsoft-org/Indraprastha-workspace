import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ApiRoutes,
  ConfirmationUtil,
  EOrderStatus,
  EToastType,
  httpPost,
  initializePagInationPayload,
  IOrder,
  IOrderPagination,
  IOrdersBy,
  IRGeneric,
  MConfirmationModalData,
  ToastService,
  AppLoadingButton,
  IOrderResponse,
} from '@shared';
import { appRoutes } from '@website/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { finalize } from 'rxjs';
import { IUpdateOrderStatus } from './order.model';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    AppLoadingButton,
    InfiniteScrollDirective,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order {
  public searchText: FormControl<string | null> = new FormControl(null);
  public payLoad: IOrderPagination = {
    ...initializePagInationPayload(),
    startDate: null,
    endDate: null,
    customerId: 0,
    status: null,
  };
  public readonly objConfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  public orders: IOrder[] = [];
  public hasMoreData = signal(true);
  public isShowloader: WritableSignal<boolean> = signal(false);
  public payloadOrderCancel: IUpdateOrderStatus = {
    orderId: 0,
    orderStatus: '',
  };

  public EOrderStatus = EOrderStatus;

  constructor(private router: Router, private toastService: ToastService) {
    const orderBy: IOrdersBy = {
      sort: 'Desc',
      fieldName: 'Id',
    };

    this.payLoad.top = 5;
    this.payLoad.ordersBy.push(orderBy);
    this.getAllOrders();
  }

  public onScrollDown() {
    this.payLoad.pageIndex = this.payLoad.pageIndex + 1;
    this.getAllOrders();
  }

  public cancelOrder(index: number) {
    const modalData: MConfirmationModalData = {
      heading: 'Cancel Order',
      body: 'Are you sure you want to canc el this order?',
      yesText: 'Yes',
      noText: 'No',
    };

    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        this.payloadOrderCancel = {
          orderId: this.orders[index].id,
          orderStatus: EOrderStatus.Cancel,
        };
        httpPost<IRGeneric<boolean>, IUpdateOrderStatus>(
          ApiRoutes.ORDERS.CHANGE_STATUS,
          this.payloadOrderCancel
        )
          .pipe(
            finalize(() => {
              this.payloadOrderCancel.orderId = 0;
            })
          )
          .subscribe({
            next: (res) => {
              if (res.data) {
                this.payLoad.pageIndex = 1;
                this.getAllOrders();
                this.toastService.show({
                  message: 'Order cancelled',
                  type: EToastType.success,
                  duration: 2000,
                });
              } else {
                this.toastService.show({
                  message: res.errorMessage,
                  type: EToastType.error,
                  duration: 2000,
                });
              }
            },
            error: (err: HttpErrorResponse) => {
              this.toastService.show({
                message: err.message,
                type: EToastType.error,
                duration: 2000,
              });
            },
          });
      }
    });
  }

  public rateAndReview(index: number) {
    this.router.navigate([appRoutes.REVIEW_RATING]);
  }

  public getAllOrders() {
    if (this.isShowloader() || !this.hasMoreData()) {
      return;
    }
    this.isShowloader.update(() => true);
    httpPost<IRGeneric<IOrderResponse>, IOrderPagination>(ApiRoutes.ORDERS.MY_ORDERS, this.payLoad)
      .pipe(finalize(() => this.isShowloader.update(() => false)))
      .subscribe({
        next: (response) => {
          if (response.data) {
            if (response.data.orders.length < this.payLoad.top) {
              this.hasMoreData.update(() => false);
            }

            if (this.payLoad.pageIndex > 1) {
              this.orders = [...this.orders, ...response.data.orders];
              return;
            }
            this.orders = response.data.orders;
          } else {
            this.orders = [];
          }
        },
      });
  }

  public searchForText() {
    this.hasMoreData.update(() => true);
    this.payLoad.pageIndex = 1;
    this.payLoad.search = this.searchText.value?.trim() ?? '';
    this.getAllOrders();
  }

  public orderDetail(index: number) {
    this.router.navigate([appRoutes.ORDER_DETAIL], {
      queryParams: {
        id: this.orders[index].orderId,
      },
    });
  }

  public getTextByStatus(status: string): string {
    switch (status) {
      case EOrderStatus.Placed:
        return 'Your order has been placed';

      case EOrderStatus.InProcess:
        return 'Your order is being processed';

      case EOrderStatus.InShipment:
        return 'Your order is on the way';

      case EOrderStatus.Complete:
        return 'Your order has been delivered';

      case EOrderStatus.Cancel:
        return 'Your order has been cancelled';

      default:
        return '';
    }
  }
}
