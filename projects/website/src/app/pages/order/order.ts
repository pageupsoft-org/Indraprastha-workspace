import { Component } from '@angular/core';
import {
  ApiRoutes,
  ConfirmationUtil,
  httpPost,
  initializePagInationPayload,
  
  MConfirmationModalData,
} from '@shared';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order {
  // public payLoad: IOrderPagination = {
  //   ...initializePagInationPayload(),
  //   startDate: null,
  //   endDate: null,
  //   customerId: 0,
  //   status: null,
  // };
  public readonly objConfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  // public orders: IOrder[] = [];

  constructor() {
    // this.getAllOrders();
  }

  public cancelOrder() {
    const modalData: MConfirmationModalData = {
      heading: 'Cancel Order',
      body: 'Are you sure you want to canc el this order?',
      yesText: 'Yes',
      noText: 'No',
    };

    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
      }
    });
  }

  // private getAllOrders() {
  //   httpPost<IRGeneric<IOrderResponse>, IOrderPagination>(
  //     ApiRoutes.ORDERS.ALL,
  //     this.payLoad
  //   ).subscribe({
  //     next: (response) => {
  //       if (response.data) {
  //         this.orders = response.data.orders;
  //       } else {
  //         this.orders = [];
  //       }
  //     },
  //   });
  // }
}
