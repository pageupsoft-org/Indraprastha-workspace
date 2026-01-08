import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../home/product-slider/product-slider';
import {
  DashboardProductTypeStringEnum,
  DescriptionTypeStringEnum,
  AppLoadingButton,
  Loader,
  PlatformService,
  ConfirmationUtil,
  getDefaultConfirmationModalData,
  MConfirmationModalData,
} from '@shared';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  appRoutes,
  CartUpdateOperation,
  IRProductDetailRoot,
  ProductDetailBase,
  WishlistService,
} from '@website/core';
import { IQueryToCheckout } from './product-detail.model';

@Component({
  selector: 'app-product-detail',
  imports: [
    ProductSlider,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppLoadingButton,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail extends ProductDetailBase implements OnInit {
  public readonly DescriptionTypeStringEnum = DescriptionTypeStringEnum;
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

  public routeToHome(){
    this.router.navigate([appRoutes.HOME]);
  }

  public enlargeImage(img: string) {
    this.productDetail().activeImage = img;
  }

  public toggleWishList(event: any) {
    this.wishlistService.toggleWishList<IRProductDetailRoot>(
      event,
      this.productDetail(),
      'isWishList',
      'id'
    );
  }
}
