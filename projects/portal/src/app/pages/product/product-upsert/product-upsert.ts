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
  initializeColorVariantForm,
  IProductForm,
  stepperFormSteps,
  IStepperStep,
  initVariantForm,
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
  public totalSteps: number = 3;
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

    // this.mutateImageControl(null);

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param && param['id']) {
        this.getProductById(+param['id']);
      }
    });
  }

  public mutateColorVariantControl(index: number | null) {
    if (index == null) {
      const newVariant = initializeColorVariantForm(null);

      // Add all stock sizes for the variant
      this.stockSize.forEach((size) => {
        newVariant.controls.stocks.push(initializeStockForm(0, size.key as EStockSize));
      });

      this.productForm.controls.colorVariants.push(newVariant);
    } else {
      this.productForm.controls.colorVariants.removeAt(index);
    }
  }

  public addVariant() {
    const newVariant = new FormGroup(initVariantForm());
    this.productForm.controls.variants.push(newVariant);
  }

  public removeVariant(index: number) {
    this.productForm.controls.variants.removeAt(index);
  }

  public mutateColorVariantImageControl(variantIndex: number, imageIndex: number | null) {
    // This method is used for removing images (clearing the slot)
    if (imageIndex !== null) {
      const variant = this.productForm.controls.colorVariants.at(variantIndex);
      const filledImages = variant.controls.colorVariantBase64.controls.filter(
        (control) => control.value && control.value.trim() !== '',
      ).length;

      // Ensure at least 1 image remains
      if (filledImages > 1) {
        variant.controls.removeURL.push(new FormControl(variant.controls.colorVariantBase64.at(imageIndex).value));
        variant.controls.colorVariantBase64.at(imageIndex).setValue(null);
      } else {
        this.toastService.show({
          type: EToastType.warning,
          message: 'At least one image is required for each variant',
          duration: 2000,
        });
      }
    }
  }

  public setAllColorVariantStock(variantIndex: number, quantity: number | null) {
    if (quantity !== null && quantity >= 0) {
      const variant = this.productForm.controls.colorVariants.at(variantIndex);
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

  // public mutateImageControl(index: number | null) {
  //   if (index == null) {
  //     if(this.productForm.controls.productBase64.length >= 6){
  //       this.toastService.show({
  //         type: EToastType.info,
  //         message: 'Cannot upload more than six image',
  //         duration: 2000
  //       })
  //     }else{
  //       this.productForm.controls.productBase64.push(new FormControl(null, Validators.required));
  //     }
  //   } else {
  //     this.productForm.controls.productBase64.removeAt(index);
  //   }
  // }

  public onColorVariantImageChange(event: any, variantIndex: number, imageIndex: number) {
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
          const variant = this.productForm.controls.colorVariants.at(variantIndex);

          if (res.validBase64Files.length === 1) {
            // Single image - just set it to the current slot
            variant.controls.colorVariantBase64
              .at(imageIndex)
              .setValue(res.validBase64Files[0] as string);
          } else {
            // Multiple images - spread from current imageIndex to next available slots
            let currentSlotIndex = imageIndex;

            res.validBase64Files.forEach((imageBase64) => {
              if (currentSlotIndex < 6) {
                // Ensure we don't exceed 6 slots
                variant.controls.colorVariantBase64
                  .at(currentSlotIndex)
                  .setValue(imageBase64 as string);
                currentSlotIndex++;
              }
            });

            // Show info if some images couldn't be added due to slot limit
            if (res.validBase64Files.length > 6 - imageIndex) {
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

  // public onProductImageChange(event: any, index: number) {
  //   const param: IConvertImageParams = initialConvertImageParam({
  //     event,
  //     allowedTypes: [ImageTypeEnum.webp, ImageTypeEnum.png, ImageTypeEnum.jpeg],
  //     expectedImgWidth: ImageSizeConst.product.width,
  //     expectedImgHeight: ImageSizeConst.product.height,
  //     maxSize: 2,
  //   });
  //   convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
  //     if (res) {
  //       if (res.validBase64Files.length) {
  //         if (res.validBase64Files.length == 1) {
  //           this.productForm.controls.productBase64
  //             .at(index)
  //             .setValue(res.validBase64Files[0] as string);
  //         } else {
  //           this.productForm.controls.productBase64.removeAt(index);
  //           res.validBase64Files.forEach((x) => {
  //             this.productForm.controls.productBase64.push(new FormControl(x as string));
  //           });
  //         }
  //       }
  //       if (res.invalidFiles.length) {
  //         this.toastService.show({
  //           message: 'Some files were invalid or had incorrect dimensions and were skipped',
  //           type: EToastType.warning,
  //           duration: 2000,
  //         });
  //       }
  //     }
  //   });

  //   event.target.value = null;
  // }

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

      // data.categoryIds = data.categoryIdsList?.map((x) => x.id) || [];
      data.categoryIds = [data.categoryId ?? 0];

      // data.productBase64 = data.productBase64.filter((x) => !x?.startsWith('https://'));
      data.colorVariants.forEach((v: any) => {
        v.colorVariantBase64 = v.colorVariantBase64.filter(
          (img: any) => img != null && !img.startsWith('https://'),
        );
      });

      delete (data as any).categoryIdsList;
      // console.log(invalidControls, data);
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
        if (ic.path.includes('colorVariantBase64') || ic.path.includes('productBase64')) {
          const pType: string = ic.path.includes('colorVariantBase64')
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

        // Load collection combo based on gender first
        this.productService
          .getCollectionByGender(res.data.gender as GenderTypeEnum)
          .subscribe((response) => {
            if (response && response.data != null) {
              this.collectionCombo = response.data;
              // Set collection after combo is loaded
              this.productForm.controls.collectionId.patchValue(res.data.collectionId);
            }
          });

        const {
          id,
          name,
          categoryIds,
          collectionId,
          isCustomSize,
          customSizeName,
          mrp,
          gender,
          colorVariants,
          descriptions,
          variants,
        } = res.data;

        // Patch basic product information
        this.productForm.patchValue({
          id,
          name,
          isCustomSize,
          customSizeName,
          mrp,
          gender,
          categoryId: categoryIds[0] || null,
          collectionId,
          isVariant: (colorVariants && colorVariants.length > 0) || (variants && variants.length > 0),
        });

        // Set categoryIds array
        this.productForm.controls.categoryIds.patchValue(categoryIds);

        // Set category dropdown selection
        const selectedCategoryObjects = categoryIds.map((id) => {
          const category = res.data.categories.find((c) => c.id === id);
          return {
            id: id,
            name: category?.name ?? '',
          };
        });
        this.productForm.controls.categoryIdsList.patchValue(selectedCategoryObjects);

        // // Clear and populate product images
        // this.productForm.controls.productBase64.clear();
        // productURL.forEach((imageUrl) => {
        //   this.productForm.controls.productBase64.push(new FormControl(imageUrl));
        // });

        // Clear and populate color variants
        this.productForm.controls.colorVariants.clear();
        colorVariants.forEach((variant) => {
          const newVariant = initializeColorVariantForm(null);

          // Patch variant basic info
          newVariant.patchValue({
            id: variant.id,
            productId: variant.productId,
            colorName: variant.colorName,
          });

          // Clear and populate variant images (up to 6 slots)
          newVariant.controls.colorVariantBase64.clear();
          for (let i = 0; i < 6; i++) {
            const imageUrl = variant.colorVariantURL[i] || null;
            newVariant.controls.colorVariantBase64.push(new FormControl(imageUrl));
          }

          // Clear and populate stocks for this variant
          newVariant.controls.stocks.clear();
          variant.stocks.forEach((stock) => {
            const stockForm = initializeStockForm(stock.quantity, stock.size as EStockSize);
            newVariant.controls.stocks.push(stockForm);
          });

          this.productForm.controls.colorVariants.push(newVariant);
        });

        // Clear and populate variants
        this.productForm.controls.variants.clear();
        if (variants && variants.length > 0) {
          variants.forEach((variant) => {
            const variantForm = new FormGroup(initVariantForm());
            
            // Patch variant data
            variantForm.patchValue({
              id: variant.id,
              productId: variant.productId,
              name: variant.name,
              description: variant.description,
              mrp: variant.mrp,
              isCustom: variant.isCustom, // Set default or get from API if available
            });

            this.productForm.controls.variants.push(variantForm);
          });
        }

        // Clear and populate descriptions
        this.productForm.controls.descriptions.clear();
        descriptions.forEach((desc) => {
          const descForm = initializeDescriptionForm(null);

          // Patch basic description info
          descForm.patchValue({
            header: desc.header,
            descriptionType: desc.descriptionType,
            shortDescription: desc.shortDescription,
          });

          // Handle different description types
          if (desc.descriptionType === EDescriptionType.Json) {
            // Parse JSON and populate jsonText array
            try {
              const jsonData = jsonToArray(JSON.parse(desc.description));
              jsonData.forEach((item) => {
                const jsonForm = initializeJsonTextForm({
                  key: item.key,
                  value: item.value,
                });
                descForm.controls.jsonText.push(jsonForm);
              });
            } catch (error) {
              console.error('Error parsing JSON description:', error);
            }
            // Clear description validators for JSON type
            descForm.controls.description.clearValidators();
          } else {
            // Set description value for non-JSON types
            descForm.controls.description.setValue(desc.description);
            descForm.controls.description.setValidators([Validators.required]);
          }

          // Add the description form to the main form
          this.productForm.controls.descriptions.push(descForm);

          // Update validation state
          descForm.markAllAsTouched();
          descForm.updateValueAndValidity({ emitEvent: false });
        });

        // Update form validation state
        this.productForm.markAllAsTouched();
        this.productForm.updateValueAndValidity();
      }
    });
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
      .catch(() => {
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
      .catch(() => {});
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
        return true; // Variants are optional
      case 3:
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
