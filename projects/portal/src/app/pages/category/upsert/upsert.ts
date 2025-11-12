import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/responseGeneric';
import { List } from '../list/list';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICategory, ICategoryForm } from '../../../core/interface/request/category';
import { ApiRoutes, ErrorHandler, EToastType, ToastService } from '@shared';
import { IGenericComboResponse } from '../../../core/interface/response/banner';

@Component({
  selector: 'app-upsert',
  imports: [ReactiveFormsModule, ErrorHandler],
  templateUrl: './upsert.html',
  styleUrl: './upsert.scss',
})
export class Upsert extends Base implements OnInit {

  public readonly dialogRef = inject(MatDialogRef<List>);
  public readonly data = inject(MAT_DIALOG_DATA);
  public collectionCombo:IGenericComboResponse[] = [] 

  public categoryForm = new FormGroup<ICategoryForm>({
    id: new FormControl(0),
    name: new FormControl(''),
    gst: new FormControl(0),
    description: new FormControl(''),
    collectionId: new FormControl(null)
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
    console.log("category add", this.categoryForm.valid, this.categoryForm.value);
    
    // if (this.categoryForm.valid) {
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
    // } else {
    //   this.categoryForm.markAsTouched()
    // }
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
      this.httpGetPromise<any>(ApiRoutes.CATEGORY.GETBYID(id)).then((response) => {
        if (response) {
          if (response.data) {
            console.log(response)
            this.categoryForm.patchValue(response.data)
          }
        }
      }).catch((error) => {
        //handle error
      })
    }

  }

}
