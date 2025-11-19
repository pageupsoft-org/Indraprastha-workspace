import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BannerList } from '../banner-list/banner-list';
import { CommonModule } from '@angular/common';
import { EBannerConnectionType } from '../../../core/enum/banner-connection-type.enum';
import { EGender } from '../../../core/enum/gender.enum';
import { EbannerTypes } from '../../../core/enum/banner-types.enum';
import { ApiRoutes, convertImageToBase64, ErrorHandler, EToastType, MStringEnumToArray, stringEnumToArray, ToastService, ValidateControl } from '@shared';
import { IBannerResponse, IGenericComboResponse } from '../../../core/interface/response/banner.response';
import { IBanner, IBannerForm } from '../../../core/interface/request/banner.request';
import { IConvertImageParams, IConvertImageResult, initialConvertImageParam } from '../../../core/interface/model/portal-util.model';
import { ImageSizeConst, ImageTypeEnum } from '../../../core/enum/image.enum';
import { convertImagesToBase64Array } from '../../../core/utils/portal-utility.util';

@Component({
  selector: 'app-banner-upsert',
  imports: [ReactiveFormsModule, CommonModule, ValidateControl],
  templateUrl: './banner-upsert.html',
  styleUrl: './banner-upsert.scss',
})
export class BannerUpsert extends Base implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BannerList>);
  readonly data = inject(MAT_DIALOG_DATA);
  public bannerConnectionTypes: MStringEnumToArray[] = stringEnumToArray(EBannerConnectionType);
  public bannerTypes: MStringEnumToArray[] = stringEnumToArray(EbannerTypes);
  public genders: MStringEnumToArray[] = stringEnumToArray(EGender);
  public combo: IGenericComboResponse[] = [];
  public selectConnectionType: string = 'None';
  public base64Image: string | ArrayBuffer | null = null;

  public bannerForm = new FormGroup<IBannerForm>({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(250)]),
    bannerConnectionType: new FormControl('None'),
    bannerType: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    bannerValueId: new FormControl(0,),
    bannerBase64: new FormControl('', [Validators.required]),
  });

  constructor(private toaster: ToastService) {
    super();
    console.log(this.bannerConnectionTypes);
  }

  ngOnInit(): void {
    this.bannerForm.controls.bannerValueId.disable();
    this.getCategoryCombo();
    this.getProductCombo()
    const id = this.data.id;
    if (id) {
      this.getBannerById(id);
    }
  }

  public onCancel(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  public async onImageChange(event: Event) {
    try {
      this.base64Image = await convertImageToBase64(event);
      this.bannerForm.controls.bannerBase64.setValue(this.base64Image as string);
    } catch (error) {
      console.error('Error converting image:', error);
    }
  }

  public onBannerSubmit() {
    console.log(this.bannerForm.value);
    if(this.bannerForm.controls.bannerBase64.value === '' || this.bannerForm.controls.bannerBase64.value === null){
      this.toaster.show({ message: 'Please upload banner image', duration: 3000, type: EToastType.error });
      return;
    }
    if (this.bannerForm.valid) {
      this.httpPostPromise<IGenericResponse<boolean>, IBanner>(
        ApiRoutes.BANNER.BASE,
        this.bannerForm.value as IBanner
      ).then((response) => {
        if (response) {
          if (response.data) {
            if (this.data.id === 0) {
              this.onCancel(true)
              this.toaster.show({ message: 'Banner Add Successful', duration: 3000, type: EToastType.success })
            }
            else {
              this.onCancel(true)
              this.toaster.show({ message: 'Banner Update Successful', duration: 3000, type: EToastType.success })
            }
          }
        }
      });
    }
  }

  private getCategoryCombo() {
    this.httpGetPromise<IGenericResponse<IGenericComboResponse[]>>(ApiRoutes.CATEGORY.GET_COMBO)
      .then((response) => {
        console.log(response);
        if (response) {
          if (response.data) {
            this.combo = response.data;
          }
        }
      })
      .catch((error) => { });
  }

  private getProductCombo() {
    this.httpGetPromise<IGenericResponse<IGenericComboResponse[]>>(ApiRoutes.PRODUCT.GET_COMBO)
      .then((response) => {
        console.log(response);
        if (response) {
          if (response.data) {
            this.combo = response.data;
          }
        }
      })
      .catch((error) => { });
  }

  public selectBannerConnectionType() {
    const bannerConnectionValue = this.bannerForm.controls.bannerConnectionType.value;
    console.log(bannerConnectionValue);
    if (bannerConnectionValue === 'Category') {
      this.bannerForm.controls.bannerValueId.reset();
      this.bannerForm.controls.bannerValueId.enable();
      this.selectConnectionType = bannerConnectionValue;
      this.bannerForm.controls.bannerValueId.setValidators([Validators.required]);
      this.bannerForm.controls.bannerValueId.updateValueAndValidity();
    }else if ( bannerConnectionValue === 'Product'){
      this.bannerForm.controls.bannerValueId.reset();
      this.bannerForm.controls.bannerValueId.enable();
      this.selectConnectionType = bannerConnectionValue;
      this.bannerForm.controls.bannerValueId.setValidators([Validators.required]);
      this.bannerForm.controls.bannerValueId.updateValueAndValidity();
    } else {
      this.bannerForm.controls.bannerValueId.reset();
      this.bannerForm.controls.bannerValueId.disable();
      this.selectConnectionType = 'None';
      this.bannerForm.controls.bannerValueId.setErrors(null);
      this.bannerForm.controls.bannerValueId.updateValueAndValidity();
    }
    console.log(this.bannerForm.value);
  }

  private getBannerById(id: number) {
    if (id) {
      this.httpGetPromise<IGenericResponse<IBannerResponse>>(ApiRoutes.BANNER.GET_BY_ID(id))
        .then((response) => {
          if (response) {
            if (response.data) {
              console.log(response);
              this.bannerForm.patchValue({
                ...response.data,
                bannerBase64: response.data.bannerURL,
              });
              this.selectConnectionType = response.data.bannerConnectionType;
            }
          }
        })
        .catch((error) => {
          //handle error
        });
    }
  }

  public onBannerImageChange(event: any) {
    console.log(event)
    const param: IConvertImageParams = initialConvertImageParam({
      event,
      allowedTypes: [ImageTypeEnum.jpeg, ImageTypeEnum.png],
      expectedImgWidth: ImageSizeConst.banner.width,
      expectedImgHeight: ImageSizeConst.banner.height,
    });

    convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
      if (res) {
        if (res.validBase64Files.length) {
          this.bannerForm.controls.bannerBase64.setValue(res.validBase64Files[0] as string);
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

  public removeBannerImage() {
    this.bannerForm.controls.bannerBase64.setValue('');
  }



}
