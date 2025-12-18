import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import AOS from 'aos';
import { ProductSlider } from './product-slider/product-slider';
import { WomenWear } from './women-wear/women-wear';
import { MensWear } from './mens-wear/mens-wear';
import {
  ApiRoutes,
  CustomToken,
  DashboardProductTypeStringEnum,
  EBannerConnectionType,
  EbannerTypes,
  GenderTypeEnum,
  httpPost,
  IBanner,
  IBannerPagination,
  IBannerResponse,
  initializePagInationPayload,
  IRGeneric,
  PlatformService,
} from '@shared';
import { Base } from '@portal/core';
import { DashboardResponseRoot, Product } from './product-slider/dashboard.response';
import { IDashboadRequest } from './product-slider/dashboard.request';
import { Collection } from '../../core/services/collection';
import { ApiCallService } from '@website/core';

@Component({
  selector: 'app-home',
  imports: [ProductSlider, WomenWear, MensWear],
  providers: [Collection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home extends Base implements AfterViewInit, OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  public readonly DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  public topBanners: string | null = null;
  public middleBanners: string | null = null;
  public productList = signal<Product[]>([]);
  public isMuted = signal(true);

  private payload: IDashboadRequest = {
    ...initializePagInationPayload(),
    type: DashboardProductTypeStringEnum.NewArrival,
  };

  constructor(private platformService: PlatformService, private apiCallService: ApiCallService) {
    super();
  }

  // On Init
  ngOnInit(): void {
    this.callAllBannerApis();

    if (this.platformService.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.getDashboardProduct();
  }

  public toggleMute() {
    if (this.videoPlayer?.nativeElement) {
      this.isMuted.update(() => !this.videoPlayer.nativeElement.muted);
      this.videoPlayer.nativeElement.muted = this.isMuted();
    }
  }

  // Initialize AOS animations
  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true,
      });
    }

    if (this.platformService.isBrowser && this.videoPlayer) {
      this.videoPlayer.nativeElement.play().catch((e) => console.log('Autoplay prevented:', e));
    }
  }

  public callAllBannerApis() {
    const topPayload = this.buildBannerPayload(
      EbannerTypes.Top,
      EBannerConnectionType.Category,
      GenderTypeEnum.Women
    );
    const middlePayload = this.buildBannerPayload(
      EbannerTypes.Middle,
      EBannerConnectionType.Category,
      GenderTypeEnum.Men
    );

    this.getBannerData(topPayload, 'top');
    this.getBannerData(middlePayload, 'middle');
  }

  public buildBannerPayload(
    bannerType: EbannerTypes,
    bannerConnectionType: EBannerConnectionType,
    gender: GenderTypeEnum
  ): IBannerPagination {
    return {
      ...initializePagInationPayload(),
      bannerType: bannerType,
      bannerConnectionType: bannerConnectionType,
      gender: gender,
    };
  }

  public getBannerData(payload: IBannerPagination, type: 'top' | 'middle') {
    this.apiCallService.getBannerData(payload, type).subscribe({
      next: (response) => {
        if (response) {
          if (response.data) {
            const banners = response.data.banners?.length ? response.data.banners[0].bannerURL : '';
            if (type === 'top') {
              this.topBanners = banners;
            } else {
              this.middleBanners = banners;
            }
          }
        }
      },
    });
  }

  private getDashboardProduct() {
    this.apiCallService.getDashboardProduct(this.payload).subscribe({
      next: (response) => {
        if (response?.data?.products) {
          this.productList.set(response.data.products);
        } else {
          this.productList.set([]);
        }
      },
      error: (error) => {
        console.error('Dashboard Product Error: ', error);
      },
    });
  }

  onBannerError(type: 'top' | 'middle') {
    if (type === 'top') {
      this.topBanners = 'assets/images/banner-image2.png';
    } else {
      this.middleBanners = 'assets/images/banner-image2.png';
    }
  }
}
