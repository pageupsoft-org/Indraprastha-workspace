import { Component, Input } from '@angular/core';
import { MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { getDefaultConfirmationModalData, MConfirmationModalData } from '../../interface/model/confirmation.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions],
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
