import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { CategoryList } from '../category-list/category-list';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiRoutes, EToastType, ICategory, ToastService, ValidateControl } from '@shared';
import { IGenericComboResponse } from '../../banner/banner.model';
import { ICategoryForm } from '../category.model';

@Component({
  selector: 'app-category-upsert',
  imports: [ReactiveFormsModule,  ValidateControl],
  templateUrl: './category-upsert.html',
  styleUrl: './category-upsert.scss',
})
export class CategoryUpsert extends Base implements OnInit {

  public readonly dialogRef = inject(MatDialogRef<CategoryList>);
  public readonly data = inject(MAT_DIALOG_DATA);
  public collectionCombo:IGenericComboResponse[] = [] 

  public categoryForm = new FormGroup<ICategoryForm>({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    gst: new FormControl(0),
    description: new FormControl(''),
    collectionId: new FormControl(null, [Validators.required]),
  })

  constructor(private toaster: ToastService) {
    super()
  }

  ngOnInit(): void {
    this.getCollectionCombo()
    const id = this.data.id
    if (id) {
      this.getCategoryById(id)
    }
  }

  public onCancel(isSuccess?:boolean) {
    this.dialogRef.close(isSuccess);
  }

  public onCategorySubmit() {
    if (this.categoryForm.valid) {
      this.httpPostPromise<IGenericResponse<boolean>, ICategory>(ApiRoutes.CATEGORY.BASE, this.categoryForm.value as ICategory).then(response => {
        if (response) {
          if (response.data) {
            if (this.data.id === 0) {
              this.onCancel(true)
              this.toaster.show({ message: 'Category Add successfully', duration: 3000, type: EToastType.success });
            }
            else {
              this.onCancel(true)
              this.toaster.show({ message: 'Category Update successfully', duration: 3000, type: EToastType.success });
            }
          }
        }
      }).catch(error => {
        // handle error 
      })
    } else {
      this.categoryForm.markAsTouched()
    }
  }

  private getCollectionCombo() {
    this.httpGetPromise<IGenericResponse<IGenericComboResponse[]>>(ApiRoutes.COLLECTION.GET_COMBO).then(response => {
      if (response) {
        if (response.data) {
          this.collectionCombo = response.data
        }
      }
    }).catch(error => {
      // handle error
    })
  }

  private getCategoryById(id: number) {
    if (id) {
      this.httpGetPromise<any>(ApiRoutes.CATEGORY.GET_BY_ID(id)).then((response) => {
        if (response) {
          if (response.data) {
            this.categoryForm.patchValue(response.data)
          }
        }
      }).catch((error) => {
        //handle error
      })
    }

  }

}
