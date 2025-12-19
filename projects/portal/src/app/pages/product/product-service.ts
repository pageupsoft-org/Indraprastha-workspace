import { Injectable } from '@angular/core';
import { ApiRoutes, GenderTypeEnum, httpGet, IRGeneric } from '@shared';
import { IGenericComboResponse } from '../banner/banner.model';
import { Observable, shareReplay, Subject } from 'rxjs';

@Injectable({   providedIn: 'root', })
export class ProductService {

  private mensCollection$!: Observable<IRGeneric<IGenericComboResponse[]>>;
  private womensCollection$!: Observable<IRGeneric<IGenericComboResponse[]>>;
  private bothCollection$!: Observable<IRGeneric<IGenericComboResponse[]>>;

  public getCollectionByGender(
    gender: GenderTypeEnum
  ): Observable<IRGeneric<IGenericComboResponse[]>> {

    switch (gender) {

      case GenderTypeEnum.Men:
        if (!this.mensCollection$) {
          this.mensCollection$ = httpGet<
            IRGeneric<IGenericComboResponse[]>
          >(ApiRoutes.COLLECTION.GET_BY_GENDER_COLLECTION(gender))
            .pipe(shareReplay(1));
        }
        return this.mensCollection$;

      case GenderTypeEnum.Women:
        if (!this.womensCollection$) {
          this.womensCollection$ = httpGet<
            IRGeneric<IGenericComboResponse[]>
          >(ApiRoutes.COLLECTION.GET_BY_GENDER_COLLECTION(gender))
            .pipe(shareReplay(1));
        }
        return this.womensCollection$;

      default:
        if (!this.bothCollection$) {
          this.bothCollection$ = httpGet<
            IRGeneric<IGenericComboResponse[]>
          >(ApiRoutes.COLLECTION.GET_BY_GENDER_COLLECTION(gender))
            .pipe(shareReplay(1));
        }
        return this.bothCollection$;
    }
  }



}
