import { Component, inject, signal, WritableSignal } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  initializePagInationPayload,
} from '../../../core/interface/request/genericPayload';
import { BannerUpsert } from '../banner-upsert/banner-upsert';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';
import { CommonModule } from '@angular/common';
import {
  ApiRoutes,
  EToastType,
  IBanner,
  IBannerPagination,
  IBannerResponse,
  MConfirmationModalData,
  ToastService,
} from '@shared';
import {
  createPaginationMetadata,
  PaginationControlMetadata,
} from '../../../core/interface/model/pagination-detail.model';
import { handlePagination } from '@portal/core';
import { SearchBar } from '../../../component/search-bar/search-bar';
import { SearchBase } from '../../../core/base/search-base';
import { Observable } from 'rxjs';
import { IModalDataSharing } from '../banner.model';

@Component({
  selector: 'app-banner-list',
  imports: [CommonModule, SearchBar],
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
  // Signal to store banner data
  public banners: WritableSignal<IBanner[]> = signal([]);
  public paginationMetaData: PaginationControlMetadata = createPaginationMetadata();
  // Cache timestamp to prevent browser image caching issues
  private cacheTimestamp: number = Date.now();

  constructor(private toaster: ToastService) {
    super();
  }

  protected override getData(): Observable<IGenericResponse<IBannerResponse>> {
    return this.httpPostObservable<IGenericResponse<IBannerResponse>, IBannerPagination>(
      ApiRoutes.BANNER.GET,
      this.payLoad,
    );
  }

  protected override dataLoadedHandler(response: IGenericResponse<IBannerResponse>): void {
    if (response.data && response.data.total) {
      // Update banners signal with new data
      this.banners.set(response.data.banners);
      // Refresh cache timestamp to force image reload
      this.cacheTimestamp = Date.now();
      handlePagination(
        this.paginationMetaData,
        response.data.total,
        this.payLoad.pageIndex,
        this.payLoad.top,
      );
    } else {
      // Clear banners if no data
      this.banners.set([]);
      this.cacheTimestamp = Date.now();
    }
  }

  public openModel(id: number = 0, index: number) {
    const data: IModalDataSharing = {
      id: id,
      showDescription: ((index == 0) || (index==3)),
      index: index
    };
    const dialogRef = this.dialog.open(BannerUpsert, {
      width: '80%',
      maxWidth: '900px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.search();
      }
    });
  }

  public deleteBanner(id: number) {
    const modalData: MConfirmationModalData = {
      heading: 'Confirm Delete',
      body: 'Are you sure you want to delete this Banner?',
      yesText: 'Yes',
      noText: 'No',
    };

    this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
      if (res) {
        this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.BANNER.GET_BY_ID(id))
          .then((response) => {
            if (response) {
              if (response.data) {
                this.toaster.show({
                  message: 'Delete Successful',
                  duration: 3000,
                  type: EToastType.success,
                });
              }
            }
          })
          .catch(() => {});
      }
    });
  }

  public getBannerImageUrl(bannerURL: string): string {
    if (!bannerURL) return 'assets/image/default-banner.jpg';
    
    // Add cache-busting timestamp to prevent browser caching issues
    const separator = bannerURL.includes('?') ? '&' : '?';
    return `${bannerURL}${separator}t=${this.cacheTimestamp}`;
  }

  public isVideo(url: string): boolean {
    if (!url) return false;

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const lowerUrl = url.toLowerCase();

    return videoExtensions.some((ext) => lowerUrl.includes(ext));
  }
}
