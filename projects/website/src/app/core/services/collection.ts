import { inject, Injectable, Signal, WritableSignal } from '@angular/core';
import { IRequestProductMenu } from '../interface/model/header.model';
import {
  ApiRoutes,
  createUrlFromObject,
  CustomToken,
  GenderTypeEnum,
  httpGet,
  initializePagInationPayload,
  IRGeneric,
  UseFetch,
} from '@shared';
import { Router } from '@angular/router';
import { IResponseCollection } from '../interface/response/collection.response';
import { ApiCallService } from './api-call-service';
import { IProductResponseRoot } from '../../../../../portal/src/app/pages/product/product.model';

@Injectable({
  providedIn: null,
})
export class Collection {
  private readonly router: Router = inject(Router);
  private readonly apiCallService: ApiCallService = inject(ApiCallService);

  public payloadGenderMenu: IRequestProductMenu = {
    ...initializePagInationPayload(),
    gender: GenderTypeEnum.Men,
    collectionIds: [],
    categoryIds: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 0,
    newlyAdded: false,
  };

  public openProductPage(collectionId: number, gender: GenderTypeEnum) {
    this.payloadGenderMenu.categoryIds = [];
    this.payloadGenderMenu.collectionIds = [];
    this.payloadGenderMenu.gender = gender;

    this.payloadGenderMenu.collectionIds.push(collectionId);

    this.router.navigate([createUrlFromObject(this.payloadGenderMenu, gender)]);
  }

  public getCollection(gender: string, responseVar: WritableSignal<IResponseCollection[]>) {
    return UseFetch(this.apiCallService.getCollection(gender))
      .then((response) => {
        if (response?.data && response.data.length) {
          responseVar.set(response.data);
        } else {
          responseVar.set([]);
        }
      })
      .catch(() => {
        responseVar.set([]);
      });
  }
}
