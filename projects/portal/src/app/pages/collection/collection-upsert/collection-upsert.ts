import { Component, inject } from '@angular/core';
import { ApiRoutes, EToastType, GenderTypeEnum, MStringEnumToArray, patternWithMessage, stringEnumToArray, ToastService, ValidateControl } from '@shared';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { Base } from '@portal/core';
import { ErrorHandler } from '@shared';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeList } from '../../employee/employee-list/employee-list';
import { ICollection, ICollectionForm } from '../collection.model';

@Component({
  selector: 'app-collection-upsert',
  imports: [CommonModule, ReactiveFormsModule, ValidateControl],
  templateUrl: './collection-upsert.html',
  styleUrl: './collection-upsert.scss',
})
export class CollectionUpsert extends Base {
  public readonly dialogRef = inject(MatDialogRef<EmployeeList>);
  public readonly data = inject(MAT_DIALOG_DATA);
  public genders: MStringEnumToArray[] = stringEnumToArray(GenderTypeEnum);
    public collectionForm = new FormGroup<ICollectionForm>({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(3), 
     patternWithMessage(/^\S(.*\S)?$/, 'starting and ending space not allowed'), patternWithMessage(/^[A-Za-z ]*$/, 'No special characters and number allowed')]),
    gender: new FormControl(null, Validators.required),
    description: new FormControl('', [ Validators.maxLength(200), 
     patternWithMessage(/^\S(.*\S)?$/, 'starting and ending space not allowed')]),
  });

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    const id = this.data.id
    if (id) {
      this.getCollectionById(id)
    }
  }



  public onCancel(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  public onCollectionSubmit() {
    if (this.collectionForm.valid) {
      this.httpPostPromise<IGenericResponse<boolean>, ICollection>(ApiRoutes.COLLECTION.BASE, this.collectionForm.value as ICollection).then(response => {
        if (this.data.id === 0) {
          this.onCancel(true)
          this.toaster.show({ message: 'Collection Add successfully', duration: 3000, type: EToastType.success });
        }
        else {
          this.onCancel(true)
          this.toaster.show({ message: 'Collection Update successfully', duration: 3000, type: EToastType.success });
        }
      })
    } else {
      this.collectionForm.markAllAsTouched()
    }
  }

  private getCollectionById(id: number) {
    if (id) {
      this.httpGetPromise<IGenericResponse<ICollection>>(ApiRoutes.COLLECTION.GET_BY_ID(id)).then((response) => {
        if (response) {
          if (response.data) {
            this.collectionForm.patchValue(response.data)
          }
        }
      }).catch((error) => {
        //handle error
      })
    }

  }


}
