import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Base } from '../../../core/base/base';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ApiRoutes,
  EDescriptionType,
  ErrorHandler,
  EStockSize,
  EToastType,
  GenderTypeEnum,
  IRGeneric,
  IRProductDetailRoot,
  jsonToArray,
  MStringEnumToArray,
  patternWithMessage,
  stringEnumToArray,
  ValidateControl,
} from '@shared';
import { CommonModule } from '@angular/common';
import {
  arrayToJson,
  convertImagesToBase64Array,
  logInvalidControls,
} from '../../../core/utils/portal-utility.util';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  IConvertImageParams,
  initialConvertImageParam,
} from '../../../core/interface/model/portal-util.model';
import { ImageSizeConst, ImageTypeEnum } from '../../../core/enum/image.enum';
import { IConvertImageResult } from '../../../core/interface/model/portal-util.model';
import { IGenericComboResponse } from '../../banner/banner.model';
import {
  IDescriptionForm,
  initializeDescriptionForm,
  initializeIProductForm,
  initializeJsonTextForm,
  initializeStockForm,
  initializeVariantForm,
  IProductForm,
  IVariantData,
} from '../product.model';

@Component({
  selector: 'app-product-upsert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ValidateControl,
  ],
  templateUrl: './product-upsert.html',
  styleUrl: './product-upsert.scss',
})
export class ProductUpsert extends Base implements OnInit {
  public categoryCombo: IGenericComboResponse[] = [];
  public genders: MStringEnumToArray[] = stringEnumToArray(GenderTypeEnum);
  public descriptionTypeEnumList: MStringEnumToArray[] = stringEnumToArray(EDescriptionType);
  public stockSize: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  public ShowDescription: boolean = false;
  public readonly EDescriptionType = EDescriptionType;
  public setAllQtyInput = new FormControl<number | null>(
    null,
    patternWithMessage(/^[1-9]\d*$/, 'Only numbers are allowed')
  );
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
    defaultOpen: false,
  };

  constructor(private activatedRoute: ActivatedRoute, public router: Router) {
    super();
  }

  ngOnInit(): void {
    this.getCategoryCombo();

    // add one default value
    this.productForm.controls.color.push(new FormControl<string>('#9c1c1c'));

    this.stockSize.forEach((size) => {
      this.productForm.controls.stocks.push(initializeStockForm(0, size.key as EStockSize));
    });

    this.mutateImageControl(null);

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param && param['id']) {
        this.getProductById(+param['id']);
      }
    });
  }

  // GET CATEGORY COMBO
  private getCategoryCombo() {
    this.httpGetPromise<IRGeneric<IGenericComboResponse[]>>(ApiRoutes.CATEGORY.GET_COMBO)
      .then((response) => {
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
      this.productForm.controls.productBase64.push(new FormControl(null, Validators.required));
    } else {
      this.productForm.controls.productBase64.removeAt(index);
    }
  }

  public onVariantImageChange(event: any, index: number) {
    const param: IConvertImageParams = initialConvertImageParam({
      event,
      allowedTypes: [ImageTypeEnum.webp],
      expectedImgWidth: ImageSizeConst.productVariant.width,
      expectedImgHeight: ImageSizeConst.productVariant.height,
      maxSize: 2,
    });

    convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
      if (res) {
        if (res.validBase64Files.length) {
          this.productForm.controls.variants
            .at(index)
            .controls.variantBase64.setValue(res.validBase64Files[0] as string);
        }
        if (res.invalidFiles.length) {
          this.toastService.show({
            message: 'Some files were invalid or had incorrect dimensions and were skipped',
            type: EToastType.warning,
            duration: 2000,
          });
        }
      }
    });

    event.target.value = null;
  }

  public onProductImageChange(event: any, index: number) {
    const param: IConvertImageParams = initialConvertImageParam({
      event,
      allowedTypes: [ImageTypeEnum.webp, ImageTypeEnum.png, ImageTypeEnum.jpeg],
      expectedImgWidth: ImageSizeConst.product.width,
      expectedImgHeight: ImageSizeConst.product.height,
      maxSize: 2,
    });
    convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
      if (res) {
        if (res.validBase64Files.length) {
          if (res.validBase64Files.length == 1) {
            this.productForm.controls.productBase64
              .at(index)
              .setValue(res.validBase64Files[0] as string);
          } else {
            this.productForm.controls.productBase64.removeAt(index);
            res.validBase64Files.forEach((x) => {
              this.productForm.controls.productBase64.push(new FormControl(x as string));
            });
          }
        }
        if (res.invalidFiles.length) {
          this.toastService.show({
            message: 'Some files were invalid or had incorrect dimensions and were skipped',
            type: EToastType.warning,
            duration: 2000,
          });
        }
      }
    });

    event.target.value = null;
  }

  public upsertProduct() {
    const invalidControls: { path: string; errors: any }[] = logInvalidControls(this.productForm);

    if (this.productForm.valid) {
      const data = this.productForm.getRawValue();
      data.descriptions.forEach((desc: any) => {
        if (desc.descriptionType === EDescriptionType.Json) {
          desc.description = JSON.stringify(arrayToJson(desc.jsonText));
        }
        delete desc.jsonText; // ✅ deletes the key from the object
      });

      data.stocks = data.stocks.filter((x) => (x.quantity ?? 0) > 0);
      data.categoryIds = data.categoryIdsList?.map((x) => x.id) || [];

      data.productBase64 = data.productBase64.filter((x) => !x?.startsWith('https://'));
      data.variants.forEach((v) => {
        if (v.variantBase64?.startsWith('https://')) {
          v.variantBase64 = '';
        }
      });

      delete (data as any).categoryIdsList;

      this.httpPostPromise<IRGeneric<number>, any>(ApiRoutes.PRODUCT.POST, data).then(
        (res: IRGeneric<number>) => {
          if (res?.data) {
            const msg: string = this.productForm.controls.id.value
              ? 'Product Updated'
              : 'Product Added';
            this.toastService.show({
              message: msg,
              type: EToastType.success,
              duration: 3000,
            });
            this.productForm = initializeIProductForm();
            this.router.navigate([this.appRoutes.PRODUCT]);
          } else {
            this.toastService.show({
              message: res.errorMessage,
              type: EToastType.error,
              duration: 3000,
            });
          }
        }
      );
    } else {
      console.log(invalidControls);
      
      invalidControls.forEach((ic: { path: string; errors: any }) => {
        if (ic.path.includes('variantBase64') || ic.path.includes('productBase64')) {
          this.toastService.show({
            message: 'Image is required',
            type: EToastType.error,
            duration: 2000,
          });
        } else {
          this.toastService.show({
            message: 'Please fill in required fields',
            type: EToastType.error,
            duration: 2000,
          });
        }
      });

      this.productForm.markAllAsTouched();
      this.productForm.updateValueAndValidity();
    }
  }

  public onDescriptionTypeChange(form: FormGroup<IDescriptionForm>) {
    if (form.controls.descriptionType.value === EDescriptionType.Json) {
      this.mutateJsonValueControl(null, form);
      form.controls.description.clearValidators();
      form.controls.description.updateValueAndValidity();
    } else {
      form.controls.description.setValidators([Validators.required]);
      form.controls.description.updateValueAndValidity();
    }
  }

  private getProductById(productId: number) {
    this.httpGetPromise<IRGeneric<IRProductDetailRoot>>(
      ApiRoutes.PRODUCT.GET_BY_ID(productId)
    ).then((res) => {
      if (res?.data) {
        // this.patchProductData(res);
        const {
          id,
          name,
          categoryIds, //not working
          isCustomSize,
          customSizeName,
          color,
          mrp,
          gender,
          productURL,
          variants,
          stocks,
          descriptions,
        } = res.data;

        this.productForm.patchValue({
          id,
          name,
          isCustomSize,
          customSizeName,
          color,
          mrp,
          gender,
        });

        // Assuming categoryIds is the array of selected IDs (e.g., [1, 5, 9])
        const selectedCategoryObjects = categoryIds.map((id) => {
          // Find the full category object from the dropdown source data
          const category = this.categoryCombo.find((c) => c.id === id);

          // Return the object expected by the dropdown (e.g., { id: 1, name: 'Fiction' })
          return {
            id: id,
            name: category?.name ?? '',
          };
        });

        // Use patchValue to update the FormControl bound to the dropdown
        this.productForm.controls.categoryIdsList.patchValue(selectedCategoryObjects);

        this.productForm.controls.color.clear();
        color.forEach((c) => {
          this.productForm.controls.color.push(new FormControl(c));
        });

        this.productForm.controls.productBase64.clear();
        productURL.forEach((p) => {
          this.productForm.controls.productBase64.push(new FormControl(p));
        });

        variants.forEach((v) => {
          const newV: IVariantData = {
            id: v.id,
            productId: v.productId,
            name: v.name,
            description: v.description,
            mrp: v.mrp,
            stocks: {
              quantity: v.stocks.quantity,
            },
            variantBase64: v.variantURL,
          };
          this.productForm.controls.variants.push(initializeVariantForm(newV));
        });

        this.productForm.controls.stocks.controls.forEach((x) => {
          x.controls.quantity.setValue(
            stocks.find((f) => f.size == x.controls.size.value)?.quantity ?? 0
          );
        });

        descriptions.forEach((d) => {
          const form = initializeDescriptionForm(null);

          const { header, descriptionType, shortDescription } = d;
          form.patchValue({ header, descriptionType, shortDescription });

          if (d.descriptionType == EDescriptionType.Json) {
            jsonToArray(JSON.parse(d.description)).forEach((v) => {
              form.controls.jsonText.push(initializeJsonTextForm({ key: v.key, value: v.value }));
            });
          } else {
            form.controls.description.setValue(d.description);
          }

          this.productForm.controls.descriptions.push(form);

          form.controls.description.clearValidators();
          form.controls.description.updateValueAndValidity({ emitEvent: false });
        });

        this.productForm.controls.stocks.disable();
      }
    });
  }

  public setAllSize() {
    if (this.setAllQtyInput.valid) {
      const qty = this.setAllQtyInput.value;
      this.productForm.controls.stocks.controls
        .filter((x) => x.controls.size.value !== EStockSize.FreeSize)
        .forEach((x) => {
          x.controls.quantity.setValue(qty);
        });
      // this.productForm.controls.stocks.updateValueAndValidity();
      this.setAllQtyInput.reset();
    }
  }
}
