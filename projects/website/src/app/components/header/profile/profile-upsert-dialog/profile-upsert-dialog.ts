import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-upsert-dialog',
  imports: [],
  templateUrl: './profile-upsert-dialog.html',
  styleUrl: './profile-upsert-dialog.scss',
})
export class ProfileUpsertDialog {
  readonly matDialogRef = inject(MatDialogRef<ProfileUpsertDialog>);

  public close() {
    this.matDialogRef.close();
  }
}
