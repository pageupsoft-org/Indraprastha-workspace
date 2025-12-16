import { Injectable, WritableSignal } from '@angular/core';
import {
  ApiRoutes,
  CustomToken,
  httpGet,
  httpPost,
  IBannerPagination,
  IBannerResponse,
  IOrderPagination,
  IOrderResponse,
  IRGeneric,
} from '@shared';
import { DashboardResponseRoot } from '../../components/new-arrival-product-card/dashboard.response';
import { IDashboadRequest } from '../../pages/home/product-slider/dashboard.request';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { IResponseCollection } from '../interface/response/collection.response';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  private newArrival$!: Observable<IRGeneric<DashboardResponseRoot>>;
  private collectionCache = new Map<string, Observable<IRGeneric<IResponseCollection[]>>>();
  private bannerCache = new Map<string, Observable<IRGeneric<IBannerResponse>>>();

  public getDashboardProduct(
    payload: IDashboadRequest
  ): Observable<IRGeneric<DashboardResponseRoot>> {
    if (!this.newArrival$) {
      this.newArrival$ = httpPost<IRGeneric<DashboardResponseRoot>, IDashboadRequest>(
        ApiRoutes.PRODUCT.DASHBOARD,
        payload,
        false,
        [{ key: CustomToken.AUTH_REQUIRED, value: false }]
      ).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.newArrival$;
  }

  public getCollection(gender: string): Observable<IRGeneric<IResponseCollection[]>> {
    if (!this.collectionCache.has(gender)) {
      const observable$ = httpGet<IRGeneric<IResponseCollection[]>>(
        ApiRoutes.COLLECTION.GET_BY_GENDER(gender),
        false,
        [{ key: CustomToken.AUTH_REQUIRED, value: false }]
      ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

      this.collectionCache.set(gender, observable$);
    }

    return this.collectionCache.get(gender)!;
  }

  public getBannerData(
    payload: IBannerPagination,
    type: 'top' | 'middle'
  ): Observable<IRGeneric<IBannerResponse>> {
    const cacheKey = `${type}-${JSON.stringify(payload)}`;

    if (!this.bannerCache.has(cacheKey)) {
      const observable$ = httpPost<IRGeneric<IBannerResponse>, IBannerPagination>(
        ApiRoutes.BANNER.GET,
        payload,
        false,
        [{ key: CustomToken.AUTH_REQUIRED, value: false }]
      ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

      this.bannerCache.set(cacheKey, observable$);
    }

    return this.bannerCache.get(cacheKey)!;
  }

}
