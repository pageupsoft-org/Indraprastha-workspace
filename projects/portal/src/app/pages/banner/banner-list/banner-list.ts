import { Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  initializePagInationPayload,
  IPaginationPayload,
} from '../../../core/interface/request/genericPayload';
import { BannerUpsert } from '../banner-upsert/banner-upsert';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { CommonModule } from '@angular/common';
import { ApiRoutes, EToastType, IBanner, IBannerPagination, IBannerResponse, MConfirmationModalData, ToastService } from '@shared';
import { PaginationController } from "../../../component/pagination-controller/pagination-controller";
import { createPaginationMetadata, PaginationControlMetadata } from '../../../core/interface/model/pagination-detail.model';
import { handlePagination } from '@portal/core';
import { SearchBar } from "../../../component/search-bar/search-bar";
import { SearchBase } from '../../../core/base/search-base';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-banner-list',
  imports: [CommonModule, PaginationController, SearchBar],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.scss',
})

export class BannerList extends SearchBase<IGenericResponse<IBannerResponse>> {
  readonly dialog = inject(MatDialog);
  protected override payLoad: IBannerPagination = {
    ...initializePagInationPayload(),
    bannerConnectionType: null,
    bannerType: null,
    gender: null,
  };
  public banners: IBanner[] = [];
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata()

  constructor(private toaster: ToastService) {
    super();
  }

  protected override getData(): Observable<IGenericResponse<IBannerResponse>> {
    return this.httpPostObservable<IGenericResponse<IBannerResponse>, IBannerPagination>(
      ApiRoutes.BANNER.GET,
      this.payLoad
    );
  }

  protected override dataLoadedHandler(response: IGenericResponse<IBannerResponse>): void {
    if (response.data && response.data.total) {
      this.banners = response.data.banners
      handlePagination(
        this.paginationMetaData,
        response.data.total,
        this.payLoad.pageIndex,
        this.payLoad.top
      )
    }else{
      this.banners = []
    }
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
        this.search()
      }
    });
  }

  public deleteBanner(id: number) {
    const modalData: MConfirmationModalData = {
      heading: 'Confirm Delete',
      body: 'Are you sure you want to delete this Banner?',
      yesText: 'Yes',
      noText: 'No'
    };

    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.BANNER.GET_BY_ID(id))
          .then((response) => {
            if (response) {
              if (response.data) {
                this.toaster.show({ message: 'Delete Successful', duration: 3000, type: EToastType.success });
              }
            }
          })
          .catch((error) => { });
      }
    })

  }

}
