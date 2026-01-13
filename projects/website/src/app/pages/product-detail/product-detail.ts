import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductSlider } from '../home/product-slider/product-slider';
import {
  DescriptionTypeStringEnum,
  AppLoadingButton,
  PlatformService,
  EDescriptionType,
  IRProductDetailRoot,
  IRGeneric,
} from '@shared';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  ApiCallService,
  appRoutes,
  CartUpdateOperation,
  // IRProductDetailRoot,
  ProductDetailBase,
  WishlistService,
} from '@website/core';
import { RCustomTailoredCombo } from '../../core/interface/response/tailor.response';
import { IsShowCustomTailorDDPipe } from "../../core/pipe/is-show-custom-tailor-dd-pipe";

@Component({
  selector: 'app-product-detail',
  imports: [
    ProductSlider,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppLoadingButton,
    NgxSkeletonLoaderModule,
    IsShowCustomTailorDDPipe
],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail extends ProductDetailBase implements OnInit {
  public readonly DescriptionTypeStringEnum = DescriptionTypeStringEnum;
  public readonly EDescriptionType = EDescriptionType;
  public readonly CartAlterEnum = CartUpdateOperation;

  public toggleAccordion(i: number) {
    const list = this.productDetail().descriptions;
    list[i]._isAccordionOpen = !list[i]._isAccordionOpen;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private platformService: PlatformService,
    private wishlistService: WishlistService,
  ) {
    super();

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param && param['id']) {
        if (this.platformService.isBrowser) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.getProductDetail(+param['id']);
      }
    });
  }

  trackByStockId(index: number, item: any) {
    return item.stockId;
  }

  public routeToHome() {
    this.router.navigate([appRoutes.HOME]);
  }

  public enlargeImage(img: string) {
    this.productDetail()._activeImage = img;
  }

  public toggleWishList(event: any) {
    this.wishlistService.toggleWishList<IRProductDetailRoot>(
      event,
      this.productDetail(),
      'isWishList',
      'id',
    );
  }
}
