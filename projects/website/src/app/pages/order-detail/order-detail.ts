import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiRoutes,
  httpGet,
  initializeOrderResponseById,
  IorderResponseById,
  IRGeneric,
} from '@shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail {
  public orderDetail: WritableSignal<IorderResponseById> = signal(initializeOrderResponseById());
  public isShowloader: WritableSignal<boolean> = signal(false);

  constructor(private activatedRoute: ActivatedRoute) {
    const params = activatedRoute.snapshot.queryParams;

    if (params && params['id']) {
      this.getOrderDetail(params['id']);
    }
  }

  private getOrderDetail(GUIDid: string) {
    this.isShowloader.update(() => true);
    httpGet<IRGeneric<IorderResponseById>>(ApiRoutes.ORDERS.GET_BY_GUID(GUIDid))
      .pipe(
        finalize(() => {
          this.isShowloader.update(() => false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.orderDetail.set(res.data);
            const address = this.orderDetail().address;
            const fullAddress =
              `${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.pinCode}`.trim();
            const fullName = `${address.firstName} ${address.lastName}`.trim();

            address.address = fullAddress;
            address.firstName = fullName;
          } else {
            this.orderDetail.set(initializeOrderResponseById());
          }
        },
        error: () => {
          this.orderDetail.set(initializeOrderResponseById());
        },
      });
  }
}
