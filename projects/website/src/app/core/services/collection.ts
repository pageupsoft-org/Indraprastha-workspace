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

@Injectable({
  providedIn: null,
})
export class Collection {
  private readonly router: Router = inject(Router);

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

  public openProductPage(collectionId: number) {
    this.payloadGenderMenu.categoryIds = [];
    this.payloadGenderMenu.collectionIds = [];
    this.payloadGenderMenu.gender = GenderTypeEnum.Women;

    this.payloadGenderMenu.collectionIds.push(collectionId);

    this.router.navigate([createUrlFromObject(this.payloadGenderMenu, GenderTypeEnum.Women)]);
  }
  public getCollection(gender: string, responseVar: WritableSignal<IResponseCollection[]>) {
    return UseFetch(
      httpGet<IRGeneric<IResponseCollection[]>>(ApiRoutes.COLLECTION.GET_BY_GENDER(gender), false, [
        { key: CustomToken.AUTH_REQUIRED, value: false },
      ])
    )
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
