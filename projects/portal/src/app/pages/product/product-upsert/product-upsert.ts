import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IDescriptionForm,
  initializeDescriptionForm,
  initializeIProductForm,
  initializeJsonTextForm,
  initializeStockForm,
  initializeVariantForm,
  IProductForm,
} from '../../../core/interface/request/product.request';
import {
  ApiRoutes,
  EDescriptionType,
  IRGeneric,
  MStringEnumToArray,
  stringEnumToArray,
} from '@shared';
import { IGenericComboResponse } from '../../../core/interface/response/banner.response';
import { EGender } from '../../../core/enum/gender.enum';
import { CommonModule } from '@angular/common';
import { EStockSize } from '../../../../../../shared/src/lib/enum/size.enum';
import { convertImagesToBase64Array } from '../../../core/utils/portal-utility.util';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-product-upsert',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-upsert.html',
  styleUrl: './product-upsert.scss',
})
export class ProductUpsert extends Base implements OnInit {
  public categoryCombo: IGenericComboResponse[] = [];
  public genders: MStringEnumToArray[] = stringEnumToArray(EGender);
  public descriptionTypeEnumList: MStringEnumToArray[] = stringEnumToArray(EDescriptionType);
  public stockSize: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  public ShowDiscription: boolean = false;
  public readonly EDiscriptionType = EDescriptionType;

  public setAllQty: WritableSignal<number> = signal(0);
  public productForm: FormGroup<IProductForm> = initializeIProductForm();

  public dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  ngOnInit(): void {
    this.getCategoryCombo();

    // add one default value
    this.productForm.controls.color.push(new FormControl<string>('#9c1c1c'));

    this.stockSize.forEach((size) => {
      this.productForm.controls.stocks.push(initializeStockForm(0, size.key as EStockSize));
    });
  }

  // public onCancel() {
  //   this.dialogRef.close();
  // }

  constructor() {
    super();
  }

  // GET CATEGORY COMBO
  private getCategoryCombo() {
    this.httpGetPromise<IRGeneric<IGenericComboResponse[]>>(ApiRoutes.CATEGORY.GET_COMBO)
      .then((response) => {
        console.log(response);
        if (response) {
          if (response.data) {
            this.categoryCombo = response.data;
          }
        }
      })
      .catch((error) => {});
  }

  public mutateColorControl(index: number | null) {
    if (index == null) {
      this.productForm.controls.color.push(new FormControl<string>('#9c1c1c'));
    } else {
      this.productForm.controls.color.removeAt(index);
    }
  }

  public mutateVariantControl(index: number | null) {
    if (index == null) {
      this.productForm.controls.variants.push(initializeVariantForm(null));
    } else {
      this.productForm.controls.variants.removeAt(index);
    }
  }
  public mutateDescriptionControl(index: number | null) {
    if (index == null) {
      this.productForm.controls.descriptions.push(initializeDescriptionForm(null));
    } else {
      this.productForm.controls.descriptions.removeAt(index);
    }
  }

  public mutateJsonValueControl(index: number | null, description: FormGroup<IDescriptionForm>) {
    if (index == null) {
      description.controls.jsonText.push(initializeJsonTextForm(null));
    } else {
      description.controls.jsonText.removeAt(index);
    }
  }
  public mutateImageControl(index: number | null) {
    if (index == null) {
      this.productForm.controls.productBase64.push(new FormControl(null));
    } else {
      this.productForm.controls.productBase64.removeAt(index);
    }
  }

  public onVariantImageChange(event: any, index: number) {
    convertImagesToBase64Array(event).then((res: (string | ArrayBuffer | null)[]) => {
      if (res && res.length) {
        this.productForm.controls.variants
          .at(index)
          .controls.variantBase64.setValue(res[0] as string);
      }
    });
  }
  public onProductImageChange(event: any, index: number) {
    convertImagesToBase64Array(event).then((res: (string | ArrayBuffer | null)[]) => {
      if (res) {
        if (res.length == 1) {
          this.productForm.controls.productBase64.at(index).setValue(res[0] as string);
        } else {
          this.productForm.controls.productBase64.removeAt(index);
          res.forEach((x) => {
            this.productForm.controls.productBase64.push(new FormControl(x as string));
          });
        }
      }
    });
  }

  public upsertProduct() {
    console.log(this.productForm.value);
  }

  public onDescriptionTypeChange(form: FormGroup<IDescriptionForm>) {
    if (form.controls.descriptionType.value == EDescriptionType.Json) {
      this.mutateJsonValueControl(null, form);
    } else {
      form.controls.jsonText.clear();
    }
  }
}
