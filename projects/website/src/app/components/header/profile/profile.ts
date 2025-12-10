import { Component, effect, EventEmitter, inject, model, OnInit, Output, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileUpsertDialog } from './profile-upsert-dialog/profile-upsert-dialog';
import { AddressUpsertDialog } from './address-upsert-dialog/address-upsert-dialog';
import { ApiRoutes, deCodeToken, httpGet, IRGeneric } from '@shared';
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
  public addressData = inject(UtilityService)
  @Output() removeFromDom: EventEmitter<boolean> = new EventEmitter<boolean>();
  public  isShown = signal(false);

  constructor(private matdialog: MatDialog, public utilityService: UtilityService) {
  }


  public close() {
    this.showProfileBar.set(false);
    this.removeFromDom.emit(true);

  }

  public upsertInfo(id: number) {
    this.matdialog.open(ProfileUpsertDialog, {
      width: '650px',
      maxWidth: '90vw',
      data: {
        id: id,
      },
    });
  }

  public upsertAddress() {
    this.matdialog.open(AddressUpsertDialog, {
      width: '650px',
      maxWidth: '90vw',
      data: {
        id: this.utilityService.profileData()?.id,
      },
    });
  }

  public toggle() {
    this.isShown.update((isShown) => !isShown);
  }




}
