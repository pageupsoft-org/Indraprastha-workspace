import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IAddresseForm, initializeAddressForm } from '../profile-upsert-dialog/profile-upsert-dialog.models';
import { ApiRoutes, EToastType, httpPost, ToastService, ValidateControl } from '@shared';

@Component({
  selector: 'app-address-upsert-dialog',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, ValidateControl],
  templateUrl: './address-upsert-dialog.html',
  styleUrl: './address-upsert-dialog.scss',
})
export class AddressUpsertDialog {

  public addressForm: FormGroup<IAddresseForm> = initializeAddressForm()
  constructor(private matDialogRef: MatDialogRef<AddressUpsertDialog>, private _toaster: ToastService) {}

  // CLOSE POPUP
  public close() {
    this.matDialogRef.close();
  }

  // ON ADDRESS SUBMIT
  public onAddressSubmit() {
    const payLoad = this.addressForm.getRawValue()
    if (this.addressForm.valid) {
      httpPost<any, any>(ApiRoutes.Address.BASE, payLoad).subscribe({
        next: (res) => {
          this._toaster.show({ message: 'Address Add Successfully', duration: 3000, type: EToastType.success })
        },
        error: (error) => {
          // handle error
        }
      })
    }
    else {
      this.addressForm.markAllAsDirty()
    }
  }
}
