import { Component, signal, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ICheckoutForm,
  initializeICheckoutForm,
  initializeResponseCheckout,
  IResponseCheckout,
} from './checkout.model';
import { ApiRoutes, httpGet, IRGeneric, ValidateControl } from '@shared';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, ValidateControl, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  public checkoutForm: FormGroup<ICheckoutForm> = initializeICheckoutForm();
  public checkoutData: WritableSignal<IResponseCheckout> = signal(initializeResponseCheckout());

  public isRedirectedFromBuyNow: WritableSignal<boolean> = signal(false);

  constructor(private activatedRoute: ActivatedRoute) {
    let buyNow = activatedRoute.snapshot.queryParams['buy_now'];
    if (buyNow && buyNow == 'buy_now') {
      this.isRedirectedFromBuyNow.update(() => true);
    } else {
      this.getCheckoutData();
    }
  }

  public onPaymentSumit() {
    console.log(this.checkoutForm.value);
    if (this.checkoutForm.valid) {
      // proceed to payment
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  private getCheckoutData() {
    httpGet<IRGeneric<IResponseCheckout>>(ApiRoutes.CART.CHECKOUT).subscribe({
      next: (res) => {
        if (res?.data) {
          this.checkoutData.set(res.data);
        } else {
          this.checkoutData.set(initializeResponseCheckout());
        }
      },
      error: () => {
        this.checkoutData.set(initializeResponseCheckout());
      },
    });
  }
}
