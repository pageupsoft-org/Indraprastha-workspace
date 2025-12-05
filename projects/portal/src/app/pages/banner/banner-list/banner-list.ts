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

@Component({
  selector: 'app-banner-list',
  imports: [CommonModule, PaginationController, SearchBar],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.scss',
})

export class BannerList extends Base implements OnInit {
  readonly dialog = inject(MatDialog);
  public payLoad: IBannerPagination = {
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
        if (response?.data && response.data.total) {
          this.banners = response.data.banners;
          handlePagination(
            this.paginationMetaData,
            response.data.total,
            this.payLoad.pageIndex,
            this.payLoad.top
          )
        }
        else{
          this.banners =[]
        }
      })
      .catch((error) => {
        // error handle
      });
  }

  public topChange(top: number) {
    this.payLoad.top = top;
    this.getBannerData();
  }

  public pageChange(pageIndex: number) {
    this.payLoad.pageIndex = pageIndex;
    this.getBannerData();
  }

  public search(value:string){
    // debugger
    this.payLoad.search = value;
    // this.searchString$.next(searchText);
    // this.
  }
}
