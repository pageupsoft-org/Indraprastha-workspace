import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { initializeProfileForm, IProfileForm, IProfilePayload, IProfileResponse } from './profile-upsert-dialog.models';
import { ApiRoutes, EToastType, httpGet, httpPost, IRGeneric, ToastService, ValidateControl } from '@shared';
import { UtilityService } from '@website/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-upsert-dialog',
  imports: [ValidateControl, ReactiveFormsModule, CommonModule],
  templateUrl: './profile-upsert-dialog.html',
  styleUrl: './profile-upsert-dialog.scss',
})
export class ProfileUpsertDialog implements OnInit {
  readonly matDialogRef = inject(MatDialogRef<ProfileUpsertDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  public profileForm: FormGroup<IProfileForm> = initializeProfileForm();
  public ProfileData: any;

  constructor(private utilityService: UtilityService, private _toaster: ToastService) { }


  //GET ID 
  ngOnInit(): void {
    this.profileForm.controls.contact.disable()
    this.ProfileData = this.utilityService.profileData();
    this.profileForm.patchValue(this.ProfileData)
  }

  // close popup
  public close(isSuccess?:boolean) {
    this.matDialogRef.close(isSuccess);
  }


  // Update Profile Information 
  public onProfileSubmit() {
    const payLoad = this.profileForm.getRawValue()
    if (this.profileForm.valid) {
      httpPost<IRGeneric<Boolean>, IProfilePayload>(ApiRoutes.CUSTOMERS.BASE, payLoad as IProfilePayload).subscribe({
        next: (res: any) => {
          if (res?.data) {
            this._toaster.show({ message: 'Profile save Successfully', duration: 3000, type: EToastType.success });
            this.close(true)
            this.utilityService.profileData.update(val => ({
              ...val!,
              firstName: payLoad.firstName ?? '',
              lastName: payLoad.lastName ?? '',
              email: payLoad.email ?? ''
            }));
          }
        },
        error: (error) => {
          // handle error
        }
      })
    }
    else {
      this.profileForm.markAllAsTouched()
    }
  }
}
