import { Component } from '@angular/core';
import { ConfirmationUtil, MConfirmationModalData } from '@shared';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order {
  public readonly objConfirmationUtil: ConfirmationUtil = new ConfirmationUtil();

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
}
