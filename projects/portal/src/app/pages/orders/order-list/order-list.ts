import { Component, OnInit } from '@angular/core';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { IOrderResponse } from '../../../core/interface/response/order.response';
import { Base } from '@portal/core';
import { initializePagInationPayload } from '../../../core/interface/request/genericPayload';
import { IOrderPagination } from '../../../core/interface/request/order.request';
import { ApiRoutes } from '@shared';

@Component({
  selector: 'app-order-list',
  imports: [],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList extends Base implements OnInit {
  
  public payLoad: IOrderPagination = {
    ...initializePagInationPayload(),
    startDate: null,
    endDate: null,
    customerId: 0,
    status: null
  };
  
  ngOnInit(): void {
    this.getAllOrders();
  }

  // Get All Orders
  private getAllOrders() {
    this.httpPostPromise<IGenericResponse<IOrderResponse>, IOrderPagination>(ApiRoutes.ORDERS.ALL, this.payLoad).then(response => {
      if (response) {
        if (response.data) {
         console.log(response)
        }
      }
    })
  }


}
