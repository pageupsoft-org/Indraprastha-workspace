import { Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  intializepagInationPayload,
  IPaginationPayload,
} from '../../../core/interface/request/genericPayload';
import { BannerUpsert } from '../banner-upsert/banner-upsert';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { CommonModule } from '@angular/common';
import { ApiRoutes, EToastType, MConfirmationModalData, ToastService } from '@shared';
import { IBannerPagination } from '../../../core/interface/request/banner.request';
import { IBannerResponse } from '../../../core/interface/response/banner.response';

@Component({
  selector: 'app-banner-list',
  imports: [CommonModule],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.scss',
})
export class BannerList extends Base implements OnInit {
  readonly dialog = inject(MatDialog);
  public payLoad: IBannerPagination = {
    ...intializepagInationPayload(),
    bannerConnectionType: null,
    bannerType: null,
    gender: null,
  };
  public banners: IBannerResponse[] = [];

  constructor(private toaster: ToastService) {
    super();
  }

  ngOnInit(): void {
    this.getBannerData();
  }

  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(BannerUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getBannerData()
      }
    });
  }

  // public getCategoryData() {
  //   this.httpPostPromise<IPaginationPayload>(apiRoutes.CATEGORY.GET, this.payLoad).then(response => {
  //     if (response) {
  //       if (response.data) {
  //         this.category = response.data.categories
  //       }
  //     }
  //   }).catch(error => {
  //     console.log(error)
  //   })
  // }

  public deleteBanner(id: number) {
    const modalData: MConfirmationModalData = {
      heading: 'Confirm Delete',
      body: 'Are you sure you want to delete this Banner?',
      yesText: 'Yes',
      noText: 'No'
    };
    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.BANNER.GETBYID(id))
          .then((response) => {
            console.log(response);
            if (response) {
              if (response.data) {
                this.toaster.show({ message: 'Delete Successful', duration: 3000, type: EToastType.success });
                this.getBannerData();
              }
            }
          })
          .catch((error) => { });
      }
    })

  }

  public getBannerData() {
    this.httpPostPromise<IGenericResponse<IBannerResponse>, IBannerPagination>(
      ApiRoutes.BANNER.GET,
      this.payLoad
    )
      .then((response) => {
        if (response) {
          if (response.data) {
            this.banners = response.data.banners;
            console.log(this.banners);
          }
        }
      })
      .catch((error) => {
        // error handle
      });
  }
}
