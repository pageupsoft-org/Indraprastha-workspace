import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { getDefaultConfirmationModalData, MConfirmationModalData } from '../../interface/model/confirmation.model';
import { GenericCancelButton } from "../generic-cancel-button/generic-cancel-button";
import { GenericSaveButton } from "../generic-save-button/generic-save-button";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
  standalone: true,
  imports: [GenericCancelButton, GenericSaveButton],
})
export class ConfirmationDialog {
  
  @Input() modalData: MConfirmationModalData = getDefaultConfirmationModalData();
  @Input() modalRef!: MatDialogRef<ConfirmationDialog, any>;

  constructor() {}

  ngOnInit(): void {}

  public close(isConfirm: boolean) {
    this.modalRef.close(isConfirm);
  }
}
