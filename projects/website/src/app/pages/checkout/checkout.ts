import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICheckoutForm, initializeICheckoutForm } from './checkout.model';
import { ValidateControl } from '@shared';
import { MatDialogClose } from "@angular/material/dialog";


@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, ValidateControl, MatDialogClose],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  public checkoutForm: FormGroup<ICheckoutForm> = initializeICheckoutForm();

  public onPaymentSumit(){
    console.log(this.checkoutForm.value);
    if(this.checkoutForm.valid){
      // proceed to payment
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
