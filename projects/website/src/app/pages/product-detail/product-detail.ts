import { Component, signal, WritableSignal } from '@angular/core';
import { ProductSlider } from '../home/product-slider/product-slider';
import { ApiRoutes, DashboardProductTypeStringEnum, EStockSize, httpGet, IRGeneric, MStringEnumToArray, stringEnumToArray } from '@shared';
import {
  initializeIRProductDetailRoot,
  IRProductDetailRoot,
} from '../../core/interface/response/product.response';
import { ActivatedRoute, Params } from '@angular/router';
import { dummyProductDetail } from '../../../dummy-data';

@Component({
  selector: 'app-product-detail',
  imports: [ProductSlider],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  public productDetail: WritableSignal<IRProductDetailRoot> = signal(
    initializeIRProductDetailRoot()
  );

  public DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  public readonly stockSizeArray: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  // public readonly stockSizeArrayWithId: MStringEnumToArray[] = stringEnumToArray(EStockSize);

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe((param: Params) => {
      if(param && param['id']){
        // this.getData(+param['id'])
      }
    });

    this.productDetail.set(dummyProductDetail);
  }

  public enlargeImage(img: string) {
    this.productDetail().activeImage = img;
  }

  private getData(productId: number) {
    httpGet<IRGeneric<IRProductDetailRoot>>(ApiRoutes.PRODUCT.GET_BY_ID(productId), true).subscribe(
      {
        next: (res: IRGeneric<IRProductDetailRoot>) => {
          if (res?.data) {
            this.productDetail.set(res.data);
          } else {
            this.productDetail.set(initializeIRProductDetailRoot());
          }
        }
      }
    );
  }
}
