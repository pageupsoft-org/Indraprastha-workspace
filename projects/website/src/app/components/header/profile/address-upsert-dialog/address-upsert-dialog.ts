import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GenericCancelButton, GenericSaveButton, AppLoadingButton } from "@shared";

@Component({
  selector: 'app-address-upsert-dialog',
  imports: [GenericCancelButton, AppLoadingButton],
  templateUrl: './address-upsert-dialog.html',
  styleUrl: './address-upsert-dialog.scss',
})
export class AddressUpsertDialog {
  constructor(private matDialogRef: MatDialogRef<AddressUpsertDialog>) {}

  public close() {
    this.matDialogRef.close();
  }
}
