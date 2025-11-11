import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { List } from '../../employee/list/list';
import { IProductForm } from '../../../core/interface/request/product';

@Component({
  selector: 'app-product-upsert',
  imports: [],
  templateUrl: './product-upsert.html',
  styleUrl: './product-upsert.scss',
})
export class ProductUpsert extends Base implements OnInit {
  readonly dialogRef = inject(MatDialogRef<List>);
  // public combo: IGenericResponse[] = [];
  // public genders: MStringEnumToArray[] = stringEnumToArray(EGender);
  public productForm = new FormGroup<IProductForm>({
    id: new FormControl(0),
    categoryIds: new FormControl(null),
    name: new FormControl(''),
    isCustomSize: new FormControl(false),
    customSizeName: new FormControl(''),
    color: new FormControl(''),
    mrp: new FormControl(0),
    // gender: new FormControl(null)
  })

  ngOnInit(): void {
    // this.getCategoryCombo();
  }

  public onCancel() {
    this.dialogRef.close();
  }

  constructor() {
    super()
  }

  // private getCategoryCombo() {
  //   this.httpGetPromise<IGenericResponse<IGenericComboResponse[]>>(ApiRoutes.CATEGORY.GET_COMBO)
  //     .then((response) => {
  //       console.log(response);
  //       if (response) {
  //         if (response.data) {
  //           this.combo = response.data;
  //         }
  //       }
  //     })
  //     .catch((error) => { });
  // }
  

}
