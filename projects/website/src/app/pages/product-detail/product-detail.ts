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
  public readonly objectCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();

  public toggleAccordion(i: number) {
    const list = this.productDetail().descriptions;
    list[i]._isAccordionOpen = !list[i]._isAccordionOpen;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private platformService: PlatformService,
    private wishlistService: WishlistService,
    private router: Router
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

  public alterQuantityCnt(operation: CartUpdateOperation) {
    const quantity = this.cartForm.controls.quantity.value ?? 0;

    if (operation === CartUpdateOperation.increase) {
      this.cartForm.controls.quantity.setValue(quantity + 1);
    } else {
      if (quantity > 1) {
        this.cartForm.controls.quantity.setValue(quantity - 1);
      }
    }
  }

  public enlargeImage(img: string) {
    this.productDetail().activeImage = img;
  }

  public buyNow() {
    if (this.utilService.isUserLoggedIn()) {
      const payload: IQueryToCheckout = {
        id: this.productDetail().id,
        name: this.productDetail().name,
        price: this.productDetail().mrp,
        size:
          this.stockSizeArrayWithIds.find(
            (val) => val.stockId == this.cartForm.controls.stockId.value
          )?.value ?? '',
        qty: this.cartForm.controls.quantity.value ?? 0,

        stockId: this.cartForm.controls.stockId.value ?? 0,
        variantStockId: this.cartForm.controls.variantStockId.value ?? 0,
        variantName: this.productDetail().variants.length
          ? this.productDetail().variants.find(
              (pv) => pv.id == this.cartForm.controls.variantStockId.value
            )?.name ?? ''
          : '',
      };

      this.router.navigate([appRoutes.CHECKOUT], {
        queryParams: {
          buy_now: true,
          data: JSON.stringify(payload),
        },
      });
    } else {
      const confirmation_model: MConfirmationModalData = {
        heading: 'Login Needed',
        body: 'Please login first to buy this item.',
        noText: 'Cancel',
        yesText: 'Sure',
      };
      this.objectCOnfirmationUtil.getConfirmation(confirmation_model).then((res: boolean) => {
        if (res) {
          this.utilService.openLoginForm.emit();
        }
      });
    }
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
