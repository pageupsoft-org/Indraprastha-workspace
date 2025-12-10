import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAddresseForm, IAddressPayload, initializeAddressForm } from '../profile-upsert-dialog/profile-upsert-dialog.models';
import { ApiRoutes, EToastType, httpGet, httpPost, IRGeneric, ToastService, ValidateControl } from '@shared';
import { COUNTRIES } from './static-country-data';
import { UtilityService } from '@website/core';

@Component({
  selector: 'app-address-upsert-dialog',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, ValidateControl],
  templateUrl: './address-upsert-dialog.html',
  styleUrl: './address-upsert-dialog.scss',
})
export class AddressUpsertDialog implements OnInit {
  readonly data = inject(MAT_DIALOG_DATA);
  public addressForm: FormGroup<IAddresseForm> = initializeAddressForm()
  constructor(private matDialogRef: MatDialogRef<AddressUpsertDialog>, private _toaster: ToastService) { }

  public countries = COUNTRIES;
  public states: string[] = [];
  public cities: string[] = [];


  ngOnInit(): void {
  }

  // CLOSE POPUP
  public close() {
    this.matDialogRef.close();
  }

  // ON ADDRESS SUBMIT
  public onAddressSubmit() {
    console.log(this.addressForm.getRawValue())
    const payLoad = this.addressForm.getRawValue()

    if (this.addressForm.valid) {
      httpPost<IRGeneric<Boolean>, IAddressPayload>(ApiRoutes.CUSTOMERS.SHIPPING_ADDRESS, payLoad as IAddressPayload).subscribe({
        next: (res) => {
          if (res) {
            if (res.data) {
              this._toaster.show({ message: 'Address Add Successfully', duration: 3000, type: EToastType.success })
              this.close()
            }
          }
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

  public onCountryChange() {
    const country = this.countries.find(c => c.name === this.addressForm.controls.country.value);
    this.states = country ? country.states.map(s => s.name) : [];
  }

  public onStateChange() {
    const country = this.countries.find(c => c.name === this.addressForm.controls.country.value);
    const state = country?.states.find(s => s.name === this.addressForm.controls.state.value);
    this.cities = state ? state.cities : [];
    console.log(this.cities)
  }

   

}

