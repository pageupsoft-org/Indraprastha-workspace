import { Component, inject, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BannerList } from '../banner-list/banner-list';
import { CommonModule } from '@angular/common';
import {
  ApiRoutes,
  EBannerConnectionType,
  EbannerTypes,
  EToastType,
  GenderTypeEnum,
  IBanner,
  IBannerResponse,
  MStringEnumToArray,
  NoLeadingTrailingSpaceDirective,
  patternWithMessage,
  stringEnumToArray,
  ToastService,
  ValidateControl,
} from '@shared';

import {
  IConvertImageParams,
  IConvertImageResult,
  initialConvertImageParam,
} from '../../../core/interface/model/portal-util.model';
import { ImageSizeConst, ImageTypeEnum } from '../../../core/enum/image.enum';
import { convertImagesToBase64Array } from '../../../core/utils/portal-utility.util';
import { Router } from '@angular/router';
import {
  IBannerForm,
  IBannerFormValue,
  IGenericComboResponse,
  IModalDataSharing,
} from '../banner.model';
import { Variable } from '../../../core/const/variable.const';

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

  constructor(
    private toaster: ToastService,
    private router: Router,
  ) {
    super();
    this.getCategoryCombo();
    this.getProductCombo();
  }

  ngOnInit(): void {
    const id = this.data.id;
    if (id) {
      this.getBannerById(id);
    }
  }

  private getImageDimensions(): { width: number; height: number } {
    const index = this.data.index;
    
    // Determine image dimensions based on index
    if (index === 1) {
      // Index 1 uses midBanner dimensions
      return {
        height: ImageSizeConst.midBanner.height,
        width: ImageSizeConst.midBanner.width
      };
    } else if (index === 3) {
      // Index 3 uses lastBanner dimensions
      return {
        height: ImageSizeConst.lastBanner.height,
        width: ImageSizeConst.lastBanner.width
      };
    } else {
      // Index 0 and 2 use banner dimensions (for video)
      return {
        height: ImageSizeConst.banner.height,
        width: ImageSizeConst.banner.width
      };
    }
  }

  public isVideoNeeded(): boolean {
    // Video is supported for index 0 and 2
    return this.data.index === 0 || this.data.index === 2;
  }

  public get maxVideoSize(): number {
    return Variable.bannerVideoSizeMb;
  }

  public get maxImageSize(): number {
    return Variable.bannerImageSizeMb;
  }

  public onCancel(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  public onBannerSubmit() {
    if (this.bannerForm.controls.bannerBase64.value === null) {
      this.toaster.show({
        message: 'Please upload banner image',
        duration: 3000,
        type: EToastType.error,
      });
      return;
    }

    if (this.bannerForm.valid) {
      const payload = this.bannerForm.getRawValue();

      const previousImage = payload.bannerBase64;
      if (previousImage && previousImage.startsWith('https')) {
        payload.bannerBase64 = '';
      }

      this.httpPostPromise<IGenericResponse<boolean>, IBannerFormValue>(
        ApiRoutes.BANNER.BASE,
        payload as IBannerFormValue,
      ).then((response) => {
        if (response) {
          if (response.data) {
            if (this.data.id === 0) {
              this.onCancel(true);
              this.toaster.show({
                message: 'Banner Add Successful',
                duration: 3000,
                type: EToastType.success,
              });
            } else {
              this.onCancel(true);
              this.toaster.show({
                message: 'Banner Update Successful',
                duration: 3000,
                type: EToastType.success,
              });
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
      .catch((error) => {});
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
      .catch((error) => {});
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
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a video file
    if (file.type.startsWith('video/')) {
      // Handle video files - validate size limit
      if (file.size > Variable.bannerVideoSizeMb * 1024 * 1024) {
        // 15MB limit for videos
        this.toaster.show({
          message: `Video file size should be less than ${Variable.bannerVideoSizeMb}MB`,
          type: EToastType.error,
          duration: 3000,
        });
        event.target.value = null;
        return;
      }

      // Convert video to base64 for preview and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.bannerForm.controls.bannerBase64.setValue(result);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle image files with proper dimensions based on index
      const imageDimensions = this.getImageDimensions();
      
      const param: IConvertImageParams = initialConvertImageParam({
        event,
        allowedTypes: [
          ImageTypeEnum.webp,
          ImageTypeEnum.png,
          ImageTypeEnum.jpeg,
          ImageTypeEnum.jpg,
        ],
        expectedImgWidth: imageDimensions.width,
        expectedImgHeight: imageDimensions.height,
        maxSize: Variable.bannerImageSizeMb,
      });

      convertImagesToBase64Array(param).then((res: IConvertImageResult) => {
        if (res) {
          if (res.validBase64Files.length) {
            this.bannerForm.controls.bannerBase64.setValue(res.validBase64Files[0] as string);
          }
          if (res.invalidFiles.length) {
            this.toaster.show({
              message: 'Some files were invalid (type, size, or dimensions) and were skipped',
              type: EToastType.warning,
              duration: 2000,
            });
          }
        }
      });
    }

    // Clear input to allow re-uploading same file
    event.target.value = null;
  }

  public removeBannerImage() {
    // Clear the banner image/video from form
    this.bannerForm.controls.bannerBase64.setValue('');
  }

  public isVideo(url: string): boolean {
    if (!url) return false;

    // Check for base64 video data (when uploaded locally)
    if (url.startsWith('data:video/')) {
      return true;
    }

    // Check for video file extensions (when loaded from server URL)
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const lowerUrl = url.toLowerCase();

    return videoExtensions.some((ext) => lowerUrl.includes(ext));
  }
}
