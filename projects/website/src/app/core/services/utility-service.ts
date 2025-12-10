import { EventEmitter, Injectable, signal, WritableSignal } from '@angular/core';
import { IResponseGenderMenuRoot } from '../interface/response/gender-menu.response';
import { IDecodeTokenKey } from '@shared';
import { IAddressPayload, IProfileResponse } from '../../components/header/profile/profile-upsert-dialog/profile-upsert-dialog.models';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  public isUserLoggedIn: WritableSignal<boolean> = signal(false);

  public genderMenuData: WritableSignal<IResponseGenderMenuRoot[]> = signal([]);

  public openLoginForm: EventEmitter<void> = new EventEmitter<void>();

  public profileData : WritableSignal<IProfileResponse | null> = signal<IProfileResponse | null>(null);

  public AddressData : WritableSignal<IAddressPayload[]> = signal([]);

  constructor() {}
}
