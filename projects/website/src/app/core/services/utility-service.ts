import { EventEmitter, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IResponseGenderMenuRoot } from '../interface/response/gender-menu.response';
import { ApiRoutes, httpGet, IRGeneric, SharedUtilService } from '@shared';
import { IProfileResponse } from '../../components/header/profile/profile-upsert-dialog/profile-upsert-dialog.models';
import { IAddressPayload } from '../../components/header/profile/address-upsert-dialog/address-upsert-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private sharedUtilService = inject(SharedUtilService);

  public isUserLoggedIn: WritableSignal<boolean> = signal(false);

  public genderMenuData: WritableSignal<IResponseGenderMenuRoot[]> = signal([]);

  public openLoginForm: EventEmitter<void> = new EventEmitter<void>();

  public profileData: WritableSignal<IProfileResponse | null> = signal<IProfileResponse | null>(
    null
  );

  public AddressData: WritableSignal<IAddressPayload[]> = signal([]);

  constructor() {
    this.sharedUtilService.localStorageCleared.subscribe(() => {
      this.isUserLoggedIn.update(() => false);
    });
  }

  public getProfileData(id: number) {
    httpGet<IRGeneric<IProfileResponse>>(ApiRoutes.CUSTOMERS.GET_BY_ID(id), false).subscribe({
      next: (response) => {
        if (response) {
          if (response.data) {
            this.profileData.set(response.data);
          }
        }
      },
    });
  }

  public getUserAddress() {
    httpGet<IRGeneric<IAddressPayload[]>>(
      ApiRoutes.CUSTOMERS.GET_SHIPPING_ADDRESS,
      false
    ).subscribe({
      next: (response) => {
        if (response) {
          if (response.data) {
            this.AddressData.set(response.data);
          } else {
            this.AddressData.set([]);
          }
        }
      },
      error: (err) => {
        this.AddressData.set([]);
      },
    });
  }
}
