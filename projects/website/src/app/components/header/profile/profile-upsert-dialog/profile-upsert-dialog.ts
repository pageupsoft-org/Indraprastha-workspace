import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { initializeProfileForm, IProfileForm } from './profile-upsert-dialog.models';
import { ApiRoutes, httpGet, httpPost, ValidateControl } from '@shared';

@Component({
  selector: 'app-profile-upsert-dialog',
  imports: [ValidateControl, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './profile-upsert-dialog.html',
  styleUrl: './profile-upsert-dialog.scss',
})
export class ProfileUpsertDialog implements OnInit {
  readonly matDialogRef = inject(MatDialogRef<ProfileUpsertDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  public profileForm: FormGroup<IProfileForm> = initializeProfileForm();
  public id: number = 0;

  //GET ID 
  ngOnInit(): void {
    const id = this.data.id;
    // this.onProfileSubmit()
    this.profileForm.controls.contact.disable()
  }

  // close popup
  public close() {
    this.matDialogRef.close();
  }

  //GET Profile DATA
  public getProfileData() {
    httpGet<any>(ApiRoutes.PROFILE.GET_BY_ID(this.id), false).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.profileForm.patchValue(res.data);
        }
      },
      error: (error) => {
        // handle error
      },
    });
  }

  // Update Profile Information 
  public onProfileSubmit(){
    const payLoad = this.profileForm.getRawValue()
    if(this.profileForm.valid){
     httpPost<any, any>(ApiRoutes.PROFILE.BASE, payLoad).subscribe({
      next: (res:any) => {
        if(res?.data){

        }
      },
      error: (error) => {
       // handle error
      }
     })
    }
    else{
      this.profileForm.markAllAsTouched()
    }
  }
}
