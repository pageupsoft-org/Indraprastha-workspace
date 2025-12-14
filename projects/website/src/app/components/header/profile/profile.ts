import {
  Component,
  effect,
  EventEmitter,
  inject,
  model,
  OnInit,
  Output,
  output,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileUpsertDialog } from './profile-upsert-dialog/profile-upsert-dialog';
import { AddressUpsertDialog } from './address-upsert-dialog/address-upsert-dialog';
import {
  ApiRoutes,
  ConfirmationUtil,
  deCodeToken,
  EToastType,
  httpDelete,
  httpGet,
  IRGeneric,
  MConfirmationModalData,
  ToastService,
} from '@shared';
import { UtilityService } from '@website/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  public showProfileBar = signal(true);
  public addressData = inject(UtilityService);
  @Output() removeFromDom: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isShown = signal(false);
  public readonly objectCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();

  constructor(
    private matdialog: MatDialog,
    public utilityService: UtilityService,
    private _toaster: ToastService
  ) {}

  public close() {
    this.showProfileBar.set(false);
    this.removeFromDom.emit(true);
  }

  public upsertInfo(id: number = 0) {
    this.matdialog.open(ProfileUpsertDialog, {
      width: '650px',
      maxWidth: '90vw',
      data: {
        id: id,
      },
    });
  }

  public upsertAddress(id: number = 0) {
    this.matdialog.open(AddressUpsertDialog, {
      width: '650px',
      maxWidth: '90vw',
      data: {
        id: id,
      },
    });
  }

  public toggle() {
    this.isShown.update((isShown) => !isShown);
  }

  public deleteShippingAddress(id: number) {
    const modalData: MConfirmationModalData = {
      heading: 'Confirm Delete',
      body: 'Are you sure you want to delete this shipping address?',
      yesText: 'Yes',
      noText: 'No',
    };

    this.objectCOnfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        httpDelete<IRGeneric<boolean>>(
          ApiRoutes.CUSTOMERS.SHIPPIBG_DELETE_BY_ID(id),
          false
        ).subscribe({
          next: (response) => {
            if (response && response.data) {
              this.utilityService.AddressData.update((list) =>
                list.filter((item) => item.id !== id)
              );
              this._toaster.show({
                message: 'Address Delete Successfully',
                duration: 3000,
                type: EToastType.success,
              });
            }
          },
        });
      }
    });
  }

  public onBackdropClick(event: MouseEvent) {
    // Only close if clicking directly on backdrop (not bubbled from children)
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
