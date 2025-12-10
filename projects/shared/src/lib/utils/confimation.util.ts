import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  getDefaultConfirmationModalData,
  MConfirmationModalData,
} from '../interface/model/confirmation.model';
import { ConfirmationDialog } from '../component/confirmation-dialog/confirmation-dialog';
// import { ConfirmationDialog, getDefaultConfirmationModalData, MConfirmationModalData } from '@shared';

export class ConfirmationUtil {
  private _matDialogService: MatDialog = inject(MatDialog);

  public getConfirmation(modalData: MConfirmationModalData | null): Promise<boolean> {
    const modalDefault: MConfirmationModalData = getDefaultConfirmationModalData();

    if (modalData == null) {
      modalData = modalDefault;
    }

    const modelRef = this._matDialogService.open(ConfirmationDialog, {
      panelClass: 'my-rounded-dialog', //do not remove this class it is being used to set border radius
      width: '600px',
      maxWidth: '80vw',
    });

    modelRef.afterOpened().subscribe(() => {
      const el = document.querySelector(
        '.confirmation_model .mat-mdc-dialog-surface, .my-rounded-dialog .mdc-dialog__surface'
      ) as HTMLElement | null;
      if (el) el.style.borderRadius = '24px';

      const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      if (backdrop) {
        backdrop.style.backdropFilter = 'blur(3px)';
        backdrop.style.backgroundColor = 'rgba(0,0,0,0.3)';
        backdrop.style.transition = 'backdrop-filter 0.3s ease';
      }
    });
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
