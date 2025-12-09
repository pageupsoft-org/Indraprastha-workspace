import { Component, effect, EventEmitter, model, OnInit, Output, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileUpsertDialog } from './profile-upsert-dialog/profile-upsert-dialog';
import { AddressUpsertDialog } from './address-upsert-dialog/address-upsert-dialog';
import { ApiRoutes, deCodeToken, httpGet, IRGeneric } from '@shared';
import { UtilityService } from '@website/core';


@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  public showProfileBar = signal(true);
  @Output() removeFromDom: EventEmitter<boolean> = new EventEmitter<boolean>();
  public ProfileData:any; 


  constructor(private matdialog: MatDialog, private utilityService:UtilityService) {}

  
  ngOnInit(): void {
   this.ProfileData = this.utilityService.profileData();
  }

  public close() {
    this.showProfileBar.set(false);
    this.removeFromDom.emit(true);
  }

  public upsertInfo(id:number) {
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
    });
  }

 


}
