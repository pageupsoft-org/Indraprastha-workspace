import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericCancelButton, AppLoadingButton, NumberOnlyValidators, NoLeadingTrailingSpaceDirective } from '@shared';
import { ApiRoutes, EToastType, httpPost, IRGeneric, ToastService, ValidateControl } from '@shared';
import { COUNTRIES } from './static-country-data';
import { UtilityService } from '@website/core';
import { IAddresseForm, IAddressPayload, initializeAddressForm } from './address-upsert-dialog.model';

@Component({
  selector: 'app-address-upsert-dialog',
  imports: [GenericCancelButton, ReactiveFormsModule, ValidateControl, AppLoadingButton, NumberOnlyValidators, NoLeadingTrailingSpaceDirective],
  templateUrl: './address-upsert-dialog.html',
  styleUrl: './address-upsert-dialog.scss',
})
export class AddressUpsertDialog implements OnInit {
  readonly data = inject(MAT_DIALOG_DATA);
  public addressForm: FormGroup<IAddresseForm> = initializeAddressForm();
  constructor(
    private matDialogRef: MatDialogRef<AddressUpsertDialog>,
    private _toaster: ToastService,
    private _utilityService: UtilityService
  ) {}
  public id: number = 0;
  public countries = COUNTRIES;
  public states: string[] = [];
  public cities: string[] = [];

  public isLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.id = this.data.id;
    if (this.id) {
      this.editAddress(this.id);
    }
  }

  // CLOSE POPUP
  public close() {
    this.matDialogRef.close();
  }

  // ON ADDRESS SUBMIT
  public onAddressSubmit() {
    const payLoad = this.addressForm.getRawValue() as IAddressPayload;

    if (this.addressForm.valid) {
      this.isLoading.update(() => true);
      httpPost<IRGeneric<number>, IAddressPayload>(
        ApiRoutes.CUSTOMERS.SHIPPING_ADDRESS,
        payLoad
      ).subscribe({
        next: (res) => {
          if (this.id === 0) {
            if (res) {
              if (res.data) {
                payLoad.id = res.data;
                this._utilityService.AddressData().push(payLoad);
                this._toaster.show({
                  message: 'Address Add Successfully',
                  duration: 3000,
                  type: EToastType.success,
                });
                this.matDialogRef.close({saved: true});
              }
            }
          } else {
            this._utilityService.AddressData.update((list) =>
              list.map((item) => (item.id === this.id ? (payLoad as IAddressPayload) : item))
            );
            this._toaster.show({
              message: 'Address Update Successfully',
              duration: 3000,
              type: EToastType.success,
            });
            this.close();
          }
          this.isLoading.update(() => false);
        },
        error: (error) => {
          this.isLoading.update(() => false);
        },
      });
    } else {
      this.addressForm.markAllAsDirty();
    }
  }

  public onCountryChange() {
    const country = this.countries.find((c) => c.name === this.addressForm.controls.country.value);
    this.states = country ? country.states.map((s) => s.name) : [];
  }

  public onStateChange() {
    const country = this.countries.find((c) => c.name === this.addressForm.controls.country.value);
    const state = country?.states.find((s) => s.name === this.addressForm.controls.state.value);
    this.cities = state ? state.cities : [];
    console.log(this.cities);
  }

  public editAddress(id: number) {
    const val = this._utilityService.AddressData().find((v) => v.id === id);
    if (!val) return;

    // Patch all fields (or patch partial)
    this.addressForm.patchValue(val);
    this.addressForm.controls.apartment.setValue(val.apartment);

    // Populate states for the patched country, then set state
    this.onCountryChange(); // fills this.states based on country control value
    this.addressForm.controls.state.patchValue(val.state);

    // Populate cities for the patched state, then set city
    this.onStateChange(); // fills this.cities based on state control value
    this.addressForm.controls.city.patchValue(val.city);
  }
}
