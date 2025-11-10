import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog, getDefaultConfirmationModalData, MConfirmationModalData } from '@shared';

export class ConfirmationUtil {
  private _matDialogService: MatDialog = inject(MatDialog);

  public getConfirmation(modalData: MConfirmationModalData | null): Promise<boolean> {
    const modalDefault: MConfirmationModalData = getDefaultConfirmationModalData();

    if (modalData == null) {
      modalData = modalDefault;
    }

    const modelRef = this._matDialogService.open(ConfirmationDialog);
    modelRef.componentInstance.modalRef = modelRef;

    modelRef.componentInstance.modalData = {
      heading: modalData.heading,
      body: modalData.body,
      yesText: modalData.yesText,
      noText: modalData.noText,
    };

    let newPromise = new Promise<boolean>((resolve, reject) => {
      modelRef.afterClosed().subscribe((res: boolean) => {
        resolve(res);
      });
    });
    return newPromise;
  }
}
