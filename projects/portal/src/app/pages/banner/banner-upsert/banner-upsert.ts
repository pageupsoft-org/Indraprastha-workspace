import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BannerList } from '../banner-list/banner-list';
import { CommonModule } from '@angular/common';
import { ApiRoutes, convertImageToBase64, EBannerConnectionType, EbannerTypes, EToastType, GenderTypeEnum, IBanner, IBannerResponse, MStringEnumToArray, NoLeadingTrailingSpaceDirective, patternWithMessage, stringEnumToArray, ToastService, ValidateControl } from '@shared';

import { IConvertImageParams, IConvertImageResult, initialConvertImageParam } from '../../../core/interface/model/portal-util.model';
import { ImageSizeConst, ImageTypeEnum } from '../../../core/enum/image.enum';
import { convertImagesToBase64Array } from '../../../core/utils/portal-utility.util';
import { Router } from '@angular/router';
import { IBannerForm, IBannerFormValue, IGenericComboResponse, IModalDataSharing } from '../banner.model';

@Component({
  selector: 'app-banner-upsert',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './banner-upsert.html',
  styleUrl: './banner-upsert.scss',
})
export class BannerUpsert extends Base implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BannerList>);
  readonly data: IModalDataSharing = inject(MAT_DIALOG_DATA);
  public bannerConnectionTypes: MStringEnumToArray[] = stringEnumToArray(EBannerConnectionType);
  public bannerTypes: MStringEnumToArray[] = stringEnumToArray(EbannerTypes);
  public genders: MStringEnumToArray[] = stringEnumToArray(GenderTypeEnum);
  public categoryCombo: IGenericComboResponse[] = [];
  public productCombo: IGenericComboResponse[] = [];
  public selectConnectionType: string | null = 'None';
  public base64Image: string | ArrayBuffer | null = null;

  public bannerForm = new FormGroup<IBannerForm>({
    id: new FormControl(0),
    name: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
    description: new FormControl(null, [Validators.maxLength(250)]),
    bannerConnectionType: new FormControl('None'),
    bannerType: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    bannerValueId: new FormControl(0),
    bannerBase64: new FormControl(null, [Validators.required]),
  });

  constructor(private toaster: ToastService, private router: Router) {
    super();
    this.getCategoryCombo();
    this.getProductCombo()
  }

  ngOnInit(): void {
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
    }
  }

  public onBannerSubmit() {
    if (this.bannerForm.controls.bannerBase64.value === null) {
      this.toaster.show({ message: 'Please upload banner image', duration: 3000, type: EToastType.error });
      return;
    }

    if (this.bannerForm.valid) {
      const payload = this.bannerForm.getRawValue();

      const previousImage = payload.bannerBase64
      if (previousImage && previousImage.startsWith('https')) {
        payload.bannerBase64 = ""
      }

      this.httpPostPromise<IGenericResponse<boolean>, IBannerFormValue>(
        ApiRoutes.BANNER.BASE,
        payload as IBannerFormValue
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
        if (response) {
          if (response.data) {
            this.categoryCombo = response.data;
          }
        }
      })
      .catch((error) => { });
  }

  private getProductCombo() {
    this.httpGetPromise<IGenericResponse<IGenericComboResponse[]>>(ApiRoutes.PRODUCT.GET_COMBO)
      .then((response) => {
        if (response) {
          if (response.data) {
            this.productCombo = response.data;
          }
        }
      })
      .catch((error) => { });
  }

  public selectBannerConnectionType() {
    const bannerConnectionValue = this.bannerForm.controls.bannerConnectionType.value;
    if (bannerConnectionValue === 'Category' || bannerConnectionValue === 'Product') {
      this.bannerForm.controls.bannerValueId.enable();
      this.selectConnectionType = bannerConnectionValue;
      this.bannerForm.controls.bannerValueId.setValidators([Validators.required]);
      this.bannerForm.controls.bannerValueId.updateValueAndValidity();
    } else {
      this.bannerForm.controls.bannerValueId.reset();
      this.bannerForm.controls.bannerValueId.disable();
      this.selectConnectionType = bannerConnectionValue;
      this.bannerForm.controls.bannerValueId.setErrors(null);
      this.bannerForm.controls.bannerValueId.updateValueAndValidity();
    }
  }

  private getBannerById(id: number) {
    if (id) {
      this.httpGetPromise<IGenericResponse<IBanner>>(ApiRoutes.BANNER.GET_BY_ID(id))
        .then((response) => {
          if (response) {
            if (response.data) {
              this.bannerForm.patchValue({
                ...response.data,
                bannerBase64: response.data.bannerURL
              
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
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a video file
    if (file.type.startsWith('video/')) {
      // Handle video files
      if (file.size > 15 * 1024 * 1024) { // 10MB limit for videos
        this.toastService.show({
          message: 'Video file size should be less than 15MB',
          type: EToastType.error,
          duration: 3000,
        });
        event.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.bannerForm.controls.bannerBase64.setValue(result);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle image files (existing logic)
      const param: IConvertImageParams = initialConvertImageParam({
        event,
        allowedTypes: [ImageTypeEnum.webp, ImageTypeEnum.png, ImageTypeEnum.jpeg],
        expectedImgWidth: ImageSizeConst.banner.width,
        expectedImgHeight: ImageSizeConst.banner.height,
        maxSize: 2
      });

      convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
        if (res) {
          if (res.validBase64Files.length) {
            this.bannerForm.controls.bannerBase64.setValue(res.validBase64Files[0] as string);
          }
          if (res.invalidFiles.length) {
            this.toastService.show({
              message: 'Some files were invalid (type, size, or dimensions) and were skipped',
              type: EToastType.warning,
              duration: 2000,
            });
          }
        }
      });
    }

    event.target.value = null;
  }

  public removeBannerImage() {
    this.bannerForm.controls.bannerBase64.setValue('');
  }

  public isVideo(url: string): boolean {
    if (!url) return false;
    
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const lowerUrl = url.toLowerCase();
    
    return videoExtensions.some(ext => lowerUrl.includes(ext));
  }



}
