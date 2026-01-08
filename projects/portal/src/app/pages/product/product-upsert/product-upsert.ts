import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ApiRoutes,
  EDescriptionType,
  EStockSize,
  EToastType,
  GenderTypeEnum,
  IRGeneric,
  IRProductDetailRoot,
  jsonToArray,
  MStringEnumToArray,
  NoLeadingTrailingSpaceDirective,
  patternWithMessage,
  stringEnumToArray,
  ValidateControl,
} from '@shared';
import { CommonModule } from '@angular/common';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Base,
  IConvertImageParams,
  ImageSizeConst,
  ImageTypeEnum,
  initialConvertImageParam,
} from '@portal/core';
import { IConvertImageResult } from '@portal/core';
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
  stepperFormSteps,
  IStepperStep,
} from '../product.model';
import { arrayToJson, convertImagesToBase64Array, logInvalidControls } from '@portal/core';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-upsert',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ValidateControl,
    NoLeadingTrailingSpaceDirective,
  ],
  templateUrl: './product-upsert.html',
  styleUrl: './product-upsert.scss',
  providers: [],
})
export class ProductUpsert extends Base implements OnInit {
  public categoryCombo: IGenericComboResponse[] = [];
  public collectionCombo: IGenericComboResponse[] = [];
  public genders: MStringEnumToArray[] = stringEnumToArray(GenderTypeEnum);
  public descriptionTypeEnumList: MStringEnumToArray[] = stringEnumToArray(EDescriptionType);
  public stockSize: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  public ShowDescription: boolean = false;
  public readonly EDescriptionType = EDescriptionType;
  public collection: string = '';
  public setAllQtyInput = new FormControl<number | null>(
    null,
    patternWithMessage(/^[1-9]\d*$/, 'Only numbers are allowed'),
  );

  // Stepper functionality
  public currentStep: number = 1;
  public totalSteps: number = 4;
  public stepperSteps: IStepperStep[] = stepperFormSteps;
  public stepTitles: string[] = stepperFormSteps.map((step) => step.title);

  public setAllQty: WritableSignal<number> = signal(0);
  public productForm: FormGroup<IProductForm> = initializeIProductForm();
  // public variants: { name: string; price: number }[] = [];
  public dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
    defaultOpen: false,
  };
  public ImageSizeConst = ImageSizeConst;
  public Math = Math;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
  ) {
    super();
  }

  ngOnInit(): void {
    // this.getCategoryCombo();

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

  public mutateColorControl(index: number | null) {
    if (index == null) {
      this.productForm.controls.color.push(new FormControl<string>('#9c1c1c'));
    } else {
      this.productForm.controls.color.removeAt(index);
    }
  }

  public mutateVariantControl(index: number | null) {
    if (index == null) {
      const newVariant = initializeVariantForm(null);
      // Add default color for new variant
      newVariant.controls.color.push(new FormControl<string>('#9c1c1c'));
      
      // Add 6 fixed image slots (all empty initially)
      for (let i = 0; i < 6; i++) {
        newVariant.controls.variantBase64.push(new FormControl<string | null>(null));
      }
      
      // Add all stock sizes for the variant
      this.stockSize.forEach((size) => {
        newVariant.controls.stocks.push(initializeStockForm(0, size.key as EStockSize));
      });
      
      this.productForm.controls.variants.push(newVariant);
    } else {
      this.productForm.controls.variants.removeAt(index);
    }
  }

  public mutateVariantColorControl(variantIndex: number, colorIndex: number | null) {
    const variant = this.productForm.controls.variants.at(variantIndex);
    if (colorIndex == null) {
      variant.controls.color.push(new FormControl<string>('#9c1c1c'));
    } else {
      variant.controls.color.removeAt(colorIndex);
    }
  }

  public mutateVariantImageControl(variantIndex: number, imageIndex: number | null) {
    debugger
    // This method is no longer used for adding images since we have fixed slots
    // Only used for removing images (clearing the slot)
    if (imageIndex !== null) {
      const variant = this.productForm.controls.variants.at(variantIndex);
      const filledImages = variant.controls.variantBase64.controls.filter(control => control.value && control.value.trim() !== '').length;
      
      // Ensure at least 1 image remains
      if (filledImages > 1) {
        variant.controls.variantBase64.at(imageIndex).setValue(null);
      } else {
        this.toastService.show({
          type: EToastType.warning,
          message: 'At least one image is required for each variant',
          duration: 2000
        });
      }
    }
  }

  public setAllVariantStock(variantIndex: number, quantity: number | null) {
    if (quantity !== null && quantity >= 0) {
      const variant = this.productForm.controls.variants.at(variantIndex);
      variant.controls.stocks.controls
        .filter((x) => x.controls.size.value !== EStockSize.FreeSize)
        .forEach((x) => {
          x.controls.quantity.setValue(quantity);
        });
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
      if(this.productForm.controls.productBase64.length >= 6){
        this.toastService.show({
          type: EToastType.info,
          message: 'Cannot upload more than six image',
          duration: 2000
        })
      }else{
        this.productForm.controls.productBase64.push(new FormControl(null, Validators.required));
      }
    } else {
      this.productForm.controls.productBase64.removeAt(index);
    }
  }

  public onVariantImageChange(event: any, variantIndex: number, imageIndex: number) {
    console.log(variantIndex, imageIndex);
    
    const param: IConvertImageParams = initialConvertImageParam({
      event,
      allowedTypes: [ImageTypeEnum.webp, ImageTypeEnum.jpeg, ImageTypeEnum.png, ImageTypeEnum.jpg],
      expectedImgWidth: ImageSizeConst.productVariant.width,
      expectedImgHeight: ImageSizeConst.productVariant.height,
      maxSize: 2,
    });

    convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
      if (res) {
        if (res.validBase64Files.length) {
          const variant = this.productForm.controls.variants.at(variantIndex);
          
          if (res.validBase64Files.length === 1) {
            // Single image - just set it to the current slot
            variant.controls.variantBase64.at(imageIndex).setValue(res.validBase64Files[0] as string);
          } else {
            // Multiple images - spread from current imageIndex to next available slots
            let currentSlotIndex = imageIndex;
            
            res.validBase64Files.forEach((imageBase64, fileIndex) => {
              if (currentSlotIndex < 6) { // Ensure we don't exceed 6 slots
                variant.controls.variantBase64.at(currentSlotIndex).setValue(imageBase64 as string);
                currentSlotIndex++;
              }
            });
            
            // Show info if some images couldn't be added due to slot limit
            if (res.validBase64Files.length > (6 - imageIndex)) {
              this.toastService.show({
                message: `Only ${6 - imageIndex} images could be added due to slot limit`,
                type: EToastType.info,
                duration: 2000,
              });
            }
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
    // const collId = parseInt(this.productForm.controls.collectionId.value)
    //console.log(this.productForm.controls.collectionId.value);
    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();
    const invalidControls: { path: string; errors: any }[] = logInvalidControls(this.productForm);

    if (this.productForm.valid && invalidControls.length == 0) {
      // return;

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
        v.variantBase64 = v.variantBase64.filter((img) => !img?.startsWith('https://'));
      });

      delete (data as any).categoryIdsList;
      //console.log(invalidControls, data)
      // return;

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
            // this.productForm = initializeIProductForm();
            this.router.navigate([this.appRoutes.PRODUCT]);
          } else {
            this.toastService.show({
              message: res.errorMessage,
              type: EToastType.error,
              duration: 3000,
            });
          }
        },
      );
    } else {
      // //console.log(invalidControls);

      invalidControls.forEach((ic: { path: string; errors: any }) => {
        if (ic.path.includes('variantBase64') || ic.path.includes('productBase64')) {
          const pType: string = ic.path.includes('variantBase64')
            ? 'Variant'
            : ic.path.includes('productBase64')
              ? 'Product'
              : '';
          this.toastService.show({
            message: `${pType} image is required`,
            type: EToastType.error,
            duration: 2000,
          });
        } else {
          this.toastService.show({
            message: 'Enter valid data',
            type: EToastType.error,
            duration: 2000,
          });
        }
      });
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
      ApiRoutes.PRODUCT.GET_BY_ID(productId),
    ).then((res) => {
      if (res?.data) {
        this.categoryCombo = res.data.categories;
        // this.patchProductData(res);
        this.productService
          .getCollectionByGender(res.data.gender as GenderTypeEnum)
          .subscribe((response) => {
            if (response && response.data != null) {
              this.collectionCombo = response.data;
              this.collectionCombo.find((c) => {
                if (c.id === res.data.collectionId) {
                  this.productForm.controls.collectionId.patchValue(res.data.collectionId);
                }
              });
            }
          });

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
          categoryId: res.data.categoryIds[0],
          isVariant: variants && variants.length > 0,
        });

        // Assuming categoryIds is the array of selected IDs (e.g., [1, 5, 9])
        const selectedCategoryObjects = categoryIds.map((id) => {
          // Find the full category object from the dropdown source data
          const category = res.data.categories.find((c) => c.id === id);

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
          const newVariant = initializeVariantForm(null);
          
          // Set basic variant data
          newVariant.patchValue({
            id: v.id,
            productId: v.productId,
            name: v.name,
            description: v.description,
            mrp: v.mrp,
          });
          
          // Add default color for existing variants (since API doesn't have color field yet)
          newVariant.controls.color.push(new FormControl('#9c1c1c'));
          
          // Add 6 fixed image slots
          for (let i = 0; i < 6; i++) {
            if (i === 0 && v.variantURL) {
              // Put existing image in first slot
              newVariant.controls.variantBase64.push(new FormControl(v.variantURL));
            } else {
              // Empty slots
              newVariant.controls.variantBase64.push(new FormControl<string | null>(null));
            }
          }
          
          // Add all stock sizes for the variant
          this.stockSize.forEach((size) => {
            const existingStock = v.stocks && v.stocks.size === size.key ? v.stocks.quantity : 0;
            newVariant.controls.stocks.push(initializeStockForm(existingStock, size.key as EStockSize));
          });
          
          this.productForm.controls.variants.push(newVariant);
        });

        this.productForm.controls.stocks.controls.forEach((x) => {
          x.controls.quantity.setValue(
            stocks.find((f) => f.size == x.controls.size.value)?.quantity ?? 0,
          );
        });

        descriptions.forEach((d) => {
          const form = initializeDescriptionForm(null);

          const { header, descriptionType, shortDescription } = d;
          form.patchValue({ header, descriptionType, shortDescription });

          if (d.descriptionType === EDescriptionType.Json) {
            jsonToArray(JSON.parse(d.description)).forEach((v) => {
              const jsonForm = initializeJsonTextForm({
                key: v.key,
                value: v.value,
              });

              form.controls.jsonText.push(jsonForm);
            });
          } else {
            form.controls.description.setValue(d.description);
          }

          // 👉 PUSH FIRST
          this.productForm.controls.descriptions.push(form);

          // 👉 THEN mark state
          form.markAllAsTouched();
          form.markAllAsDirty();
          form.updateValueAndValidity({ emitEvent: false });

          form.controls.description.clearValidators();
          form.controls.description.updateValueAndValidity({ emitEvent: false });
        });

        this.productForm.controls.stocks.disable();
        // console.log(this.productForm.errors);
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

  public getCollectionByGender() {
    console.log('getCollectionByGender called');
    // this.productForm.controls.collectionId.reset();
    // this.productForm.controls.categoryIdsList.reset();
    this.categoryCombo = [];
    const gender = this.productForm.controls.gender.value || '';
    this.httpGetPromise<IRGeneric<IGenericComboResponse[]>>(
      ApiRoutes.COLLECTION.GET_BY_GENDER_COLLECTION(gender),
    )
      .then((res) => {
        //console.log(res)
        if (res && res.data != null) {
          this.collectionCombo = res.data;
        }
      })
      .catch((error) => {
        // error handle
      });
  }

  public getCategoryByCollectionId() {
    // this.productForm.controls.categoryIdsList.reset();
    console.log(
      'getCategoryByCollectionId called',
      this.productForm.controls.collectionId.value,
      typeof this.productForm.controls.collectionId.value,
    );
    this.categoryCombo = [];
    const id = Number(this.productForm.controls.collectionId.value) || 0;
    //console.log(id);
    this.httpGetPromise<IRGeneric<IGenericComboResponse[]>>(
      ApiRoutes.CATEGORY.GET_BY_ID_CATEGORY(id),
    )
      .then((response) => {
        if (response) {
          if (response.data != null) {
            this.categoryCombo = response.data;
          }
        }
      })
      .catch((error) => {});
  }

  // Stepper Navigation Methods
  public nextStep(): void {   
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  public previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  public isStepCompleted(step: number): boolean {
    // Add validation logic for each step
    switch (step) {
      case 1:
        return this.isStepOneValid();
      case 2:
        // At least one image and one color
        const hasValidImages = this.productForm.controls.productBase64.controls.some(
          (control) => control.value && control.value.trim() !== '',
        );
        const hasValidColors = this.productForm.controls.color.controls.some(
          (control) => control.value && control.value.trim() !== '',
        );
        return hasValidImages && hasValidColors;
      case 3:
        return true; // Variants are optional
      case 4:
        return true; // Descriptions are optional
      default:
        return false;
    }
  }

  private isStepOneValid(): boolean {
    const nameValid = this.productForm.controls.name.valid;
    const genderValid = this.productForm.controls.gender.valid;
    const collectionValid = this.productForm.controls.collectionId.valid;
    const categoryValid = this.productForm.controls.categoryId.valid;
    const mrpValid = this.productForm.controls.mrp.valid;
    return nameValid && genderValid && collectionValid && categoryValid && mrpValid;
  }

  public canProceedToNextStep(): boolean {
    return this.isStepCompleted(this.currentStep);
  }

  // Helper method to get current step configuration
  public getCurrentStepConfig(): IStepperStep {
    return this.stepperSteps[this.currentStep - 1];
  }

  // Helper method to get next step button text
  public getNextButtonText(): string {
    const currentConfig = this.getCurrentStepConfig();
    return currentConfig.nextButtonText || 'Next';
  }
}
