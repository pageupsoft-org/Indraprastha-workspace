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
  constructor(private matDialogRef: MatDialogRef<AddressUpsertDialog>, private _toaster: ToastService, private _utilityService: UtilityService) { }
  public id: number = 0;
  public countries = COUNTRIES;
  public states: string[] = [];
  public cities: string[] = [];


  ngOnInit(): void {
    this.id = this.data.id;
    if (this.id) {
      this.editAddress(this.id)
    }
    console.log(this.id)
  }

  // CLOSE POPUP
  public close() {
    this.matDialogRef.close();
  }

  // ON ADDRESS SUBMIT
  public onAddressSubmit() {

    console.log(this.id)
    const payLoad = this.addressForm.getRawValue() as IAddressPayload

    if (this.addressForm.valid) {
      httpPost<IRGeneric<number>, IAddressPayload>(ApiRoutes.CUSTOMERS.SHIPPING_ADDRESS, payLoad).subscribe({
        next: (res) => {
          if (this.id === 0) {
            console.log("id", this.id)
            if (res) {
              if (res.data) {
                payLoad.id = res.data;
                this._utilityService.AddressData().push(payLoad);
                
                console.log(this._utilityService.AddressData())
                console.log(this._utilityService.AddressData())
                this._toaster.show({ message: 'Address Add Successfully', duration: 3000, type: EToastType.success })
                this.close()
              }
            }
          }
          else {
            this._utilityService.AddressData.update(list =>
              list.map(item =>
                item.id === this.id ? (payLoad as IAddressPayload) : item
              )
            );
            this._toaster.show({ message: 'Address Update Successfully', duration: 3000, type: EToastType.success })
            this.close()
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

  public editAddress(id: number) {
    console.log(this._utilityService.AddressData())
    const val = this._utilityService.AddressData().find(v => v.id === id);
    console.log(val)
    if (!val) return;

    // Patch all fields (or patch partial)
    this.addressForm.patchValue(val);
    this.addressForm.controls.apartment.setValue(val.apartment)

    // Populate states for the patched country, then set state
    this.onCountryChange();          // fills this.states based on country control value
    this.addressForm.controls.state.patchValue(val.state);

    // Populate cities for the patched state, then set city
    this.onStateChange();            // fills this.cities based on state control value
    this.addressForm.controls.city.patchValue(val.city);
  }







}

