import { Component, OnInit, signal, WritableSignal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class ProductDetail extends ProductDetailBase implements OnInit, AfterViewInit {
  @ViewChild('mainProductImage') mainProductImage!: ElementRef<HTMLImageElement>;
  @ViewChild('magnifiedView') magnifiedView!: ElementRef<HTMLDivElement>;
  @ViewChild('lens') lens!: ElementRef<HTMLDivElement>;
  public readonly DescriptionTypeStringEnum = DescriptionTypeStringEnum;
  public readonly EDescriptionType = EDescriptionType;
  public readonly CartAlterEnum = CartUpdateOperation;

  public toggleAccordion(i: number) {
    const list = this.productDetail().descriptions;
    list[i]._isAccordionOpen = !list[i]._isAccordionOpen;
  }

  readonly zoomFactor = 3; // Magnification level
  readonly lensSizeFactor = 1.2; // Factor to increase lens size

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

  ngAfterViewInit(): void {
    // This lifecycle hook ensures that mainProductImage and magnifiedView are available.
    // The actual manipulation will happen in magnify() and hideMagnifier().
  }

  public magnify(event: MouseEvent): void {
    if (!this.mainProductImage || !this.magnifiedView || !this.lens || !this.productDetail()._activeImage) {
      return;
    }

    const mainImage = this.mainProductImage.nativeElement;
    const magnifiedGlass = this.magnifiedView.nativeElement;
    const lens = this.lens.nativeElement;

    // Use classList to control visibility
    magnifiedGlass.classList.remove('hidden');
    lens.classList.remove('hidden');

    // Calculate lens size
    const lensWidth = (magnifiedGlass.offsetWidth / this.zoomFactor) * this.lensSizeFactor;
    const lensHeight = (magnifiedGlass.offsetHeight / this.zoomFactor) * this.lensSizeFactor;

    // Set lens size
    lens.style.width = `${lensWidth}px`;
    lens.style.height = `${lensHeight}px`;

    // Set the background image for the magnified view
    magnifiedGlass.style.backgroundImage = `url('${this.productDetail()._activeImage}')`;
    magnifiedGlass.style.backgroundRepeat = 'no-repeat';
    magnifiedGlass.style.backgroundSize =
      `${mainImage.width * this.zoomFactor}px ${mainImage.height * this.zoomFactor}px`;

    // Calculate the cursor position relative to the image
    const rect = mainImage.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Prevent lens from going out of bounds
    x = Math.max(lensWidth / 2, Math.min(x, mainImage.width - lensWidth / 2));
    y = Math.max(lensHeight / 2, Math.min(y, mainImage.height - lensHeight / 2));

    // Position the lens
    const lensX = x - lensWidth / 2;
    const lensY = y - lensHeight / 2;
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    // Position the background image inside the magnified glass
    magnifiedGlass.style.backgroundPosition =
      `-${(lensX * this.zoomFactor)}px -${(lensY * this.zoomFactor)}px`;

    // Position the magnified glass
    const leftPos = mainImage.offsetWidth + 10;
    const topPos = 0;
    magnifiedGlass.style.left = `${leftPos}px`;
    magnifiedGlass.style.top = `${topPos}px`;
  }

  public hideMagnifier(): void {
    if (this.magnifiedView && this.lens) {
      this.magnifiedView.nativeElement.classList.add('hidden');
      this.lens.nativeElement.classList.add('hidden');
    }
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
