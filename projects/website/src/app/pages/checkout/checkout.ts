import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICheckoutForm, initializeICheckoutForm } from './checkout.model';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  public checkoutForm: FormGroup<ICheckoutForm> = initializeICheckoutForm();
}
