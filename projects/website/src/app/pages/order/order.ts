import { Component, signal, WritableSignal } from '@angular/core';
import { ApiRoutes, ConfirmationUtil, EOrderStatus, httpGet, httpPost, initializePagInationPayload, IRGeneric, MConfirmationModalData } from '@shared';
import { IOrderPagination, IOrderResponse, orders } from './order.model';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order {
  public readonly objConfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  public payLoad : IOrderPagination = {
    ...initializePagInationPayload(),
    startDate : null,
    endDate : null,
    customerId : null,
    status : EOrderStatus.Placed
  }
  public ordersData : WritableSignal<orders[]> = signal([])

  public cancelOrder() {
    const modalData: MConfirmationModalData = {
      heading: 'Cancel Order',
      body: 'Are you sure you want to cancel this order?',
      yesText: 'Yes',
      noText: 'No',
    };

    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
      }
    });
  }

  // GET MY ORDERS DATA
  public getAllorders(){
    httpPost<IRGeneric<orders>, IOrderPagination>(ApiRoutes.ORDERS.ALL, this.payLoad).subscribe({
      next: (response) => {
       if(response && response.data){
        // this.ordersData.set([response.data])
       }
      }
    })
  }

}
