import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../home/product-slider/product-slider';
import {
  DashboardProductTypeStringEnum,
  DescriptionTypeStringEnum,
  AppLoadingButton,
  Loader,
  PlatformService,
} from '@shared';
import { ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CartUpdateOperation, ProductDetailBase } from '@website/core';

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

  constructor(private activatedRoute: ActivatedRoute, private platformService: PlatformService) {
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
}
