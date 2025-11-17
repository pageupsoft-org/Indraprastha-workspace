import { Component, OnInit } from '@angular/core';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { IOrder, IOrderResponse } from '../../../core/interface/response/order.response';
import { Base } from '@portal/core';
import { initializePagInationPayload } from '../../../core/interface/request/genericPayload';
// import { IOrderPagination } from '../../../core/interface/request/order.request';
import { ApiRoutes, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { Route, Router } from '@angular/router';
import { IOrderPagination } from '../../../core/interface/request/order.request';

@Component({
  selector: 'app-order-list',
  imports: [],
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

  public orders: IOrder[] = [];

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
        }
      }
    })
  }

  // ADD ID WHEN USER VIEW OR UPDATE
  public routeToUpsertPage(orderId: number) {
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


}
